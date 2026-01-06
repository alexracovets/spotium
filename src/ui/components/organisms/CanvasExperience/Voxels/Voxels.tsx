'use client'

import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { useEffect, useRef, useCallback, useMemo } from 'react'
import { MeshStandardNodeMaterial } from 'three/webgpu'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import {
  positionLocal,
  smoothstep,
  normalView,
  attribute,
  uniform,
  texture,
  float,
  mix,
} from 'three/tsl'

import { useModel } from '@store'

import servicesData from './data/services.json'
import aboutData from './data/about.json'
import logoData from './data/logo.json'

// Кількість воекселів
const FIXED_INSTANCE_COUNT = 20000
const HIDDEN_POSITION = new THREE.Vector3(0, -1000, 0)

// Параметри воекселів
const params = {
  boxSize: 0.18,
  boxRoundness: 0.03,
}

const TEXTURE_PATH = '/texture/voxel/white.png'

// Тип для даних вокселів з JSON
type VoxelDataItem = {
  position: {
    x: number
    y: number
    z: number
  }
}

export const Voxels = () => {
  const {
    activeModel,
    setActiveModel,
    modelsWrapperWidth,
    modelsWrapperHeight,
    modelsWrapperX,
    modelsWrapperY,
  } = useModel()
  const { camera, size } = useThree()

  const meshRef = useRef<THREE.InstancedMesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Анімації
  const currentModelIdxRef = useRef<number>(0)
  const isAnimatingRef = useRef<boolean>(false)

  // Геометрія
  const geometry = useMemo(() => {
    const geo = new THREE.InstancedBufferGeometry()

    // Базова геометрія
    const baseGeometry = new RoundedBoxGeometry(
      params.boxSize,
      params.boxSize,
      params.boxSize,
      2,
      params.boxRoundness,
    )

    geo.index = baseGeometry.index
    geo.setAttribute('position', baseGeometry.attributes.position)
    geo.setAttribute('normal', baseGeometry.attributes.normal)
    geo.setAttribute('uv', baseGeometry.attributes.uv)

    // Позиція вокселля
    const aPositionStart = new Float32Array(FIXED_INSTANCE_COUNT * 3)
    const aPositionEnd = new Float32Array(FIXED_INSTANCE_COUNT * 3)
    // Масштаб вокселя
    const aMisc = new Float32Array(FIXED_INSTANCE_COUNT * 3)

    for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
      const idx3 = i * 3

      // Приховування вокселя при старті анміції
      aMisc[idx3] = 0
      aMisc[idx3 + 1] = 0
      aMisc[idx3 + 2] = Math.random()

      aPositionStart[idx3] = HIDDEN_POSITION.x
      aPositionStart[idx3 + 1] = HIDDEN_POSITION.y
      aPositionStart[idx3 + 2] = HIDDEN_POSITION.z

      aPositionEnd[idx3] = HIDDEN_POSITION.x
      aPositionEnd[idx3 + 1] = HIDDEN_POSITION.y
      aPositionEnd[idx3 + 2] = HIDDEN_POSITION.z
    }

    geo.setAttribute('aPositionStart', new THREE.InstancedBufferAttribute(aPositionStart, 3))
    geo.setAttribute('aPositionEnd', new THREE.InstancedBufferAttribute(aPositionEnd, 3))
    geo.setAttribute('aMisc', new THREE.InstancedBufferAttribute(aMisc, 3))

    geo.instanceCount = FIXED_INSTANCE_COUNT

    return geo
  }, [])

  // TSL Setup
  const uProgress = useMemo(() => uniform(0), [])

  // Завантаження текстури
  const voxelTexture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load(TEXTURE_PATH)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  const material = useMemo(() => {
    const m = new MeshStandardNodeMaterial()

    // Атрибути
    const aPositionStart = attribute('aPositionStart', 'vec3')
    const aPositionEnd = attribute('aPositionEnd', 'vec3')
    const aMisc = attribute('aMisc', 'vec3')

    // Розпаковка атрибутів
    const aScaleStart = aMisc.x
    const aScaleEnd = aMisc.y
    const aRandom = aMisc.z

    // Логіка появи
    const duration = float(0.6)
    const delay = aRandom.mul(0.4)

    // Мапування uProgress (0..1) до локальної прогресії (0..1)
    const t = smoothstep(delay, delay.add(duration), uProgress)

    // Анімація з esing
    const s = float(1.70158)
    const tMinus1 = t.sub(1.0)
    const easedT = tMinus1
      .mul(tMinus1)
      .mul(tMinus1.mul(s.add(1.0)).add(s))
      .add(1.0)

    // Інтерполяція позиції
    const pos = mix(aPositionStart, aPositionEnd, easedT)

    // Інтерполяція масштабу
    const scale = mix(aScaleStart, aScaleEnd, t)

    // Застосування позиції та масштабу
    m.positionNode = pos.add(positionLocal.mul(scale))

    // Matcap: перетворюємо нормалі в UV координати
    // normalView дає нормалі в view space (-1..1)
    // Перетворюємо в UV координати (0..1)
    const matcapUV = normalView.xy.mul(0.5).add(0.5)
    const matcapColor = texture(voxelTexture, matcapUV)
    const finalColor = matcapColor

    m.colorNode = finalColor

    return m
  }, [uProgress, voxelTexture])

  // Обробка даних при ініціалізації
  const voxelDataPerModel = useMemo(() => {
    const rawData: VoxelDataItem[][] = [aboutData, logoData, servicesData]
    return rawData.map((data) =>
      data.map((item: VoxelDataItem) => ({
        position: new THREE.Vector3(item.position.x, item.position.y, item.position.z),
      })),
    )
  }, [])

  // Перемикання моделей
  const switchToModel = useCallback(
    (newModelIdx: number) => {
      // обираєсо модель для відмалювання
      const targetData = voxelDataPerModel[newModelIdx]
      if (!targetData) return

      isAnimatingRef.current = true

      // створюємо буфери для позицій та масштабу
      const attrPosStart = geometry.attributes.aPositionStart as THREE.InstancedBufferAttribute
      const attrPosEnd = geometry.attributes.aPositionEnd as THREE.InstancedBufferAttribute
      const attrMisc = geometry.attributes.aMisc as THREE.InstancedBufferAttribute

      // 1. Копіюємо позиції End в Start
      attrPosStart.array.set(attrPosEnd.array)

      // Копіюємо масштаби End в Start
      const miscArray = attrMisc.array as Float32Array
      for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
        const idx3 = i * 3
        miscArray[idx3] = miscArray[idx3 + 1] // scaleStart = scaleEnd
      }

      // 2. Встановлюємо нові позиції та масштаби
      const posEndArray = attrPosEnd.array as Float32Array

      for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
        const idx3 = i * 3

        if (i < targetData.length) {
          const voxel = targetData[i]
          posEndArray[idx3] = voxel.position.x
          posEndArray[idx3 + 1] = voxel.position.y
          posEndArray[idx3 + 2] = voxel.position.z

          miscArray[idx3 + 1] = 1.0
        } else {
          // Приховуємо не використані воксели
          posEndArray[idx3] = HIDDEN_POSITION.x
          posEndArray[idx3 + 1] = HIDDEN_POSITION.y
          posEndArray[idx3 + 2] = HIDDEN_POSITION.z

          miscArray[idx3 + 1] = 0.0
        }
      }

      // Помічаємо атрибути як потребуючи оновлення
      attrPosStart.needsUpdate = true
      attrPosEnd.needsUpdate = true
      attrMisc.needsUpdate = true

      // 3. Запускаємо анімацію uProgress
      uProgress.value = 0

      gsap.killTweensOf(uProgress)
      gsap.to(uProgress, {
        value: 1,
        duration: 1.5,
        ease: 'power1.out',
        onComplete: () => {
          isAnimatingRef.current = false
        },
      })

      currentModelIdxRef.current = newModelIdx
    },
    [uProgress, geometry, voxelDataPerModel],
  )

  // Обчислення bounding box для поточної моделі
  const currentModelBoundingBox = useMemo(() => {
    const modelData = voxelDataPerModel[activeModel]
    if (!modelData || modelData.length === 0) return null

    const box = new THREE.Box3()
    modelData.forEach((voxel) => {
      box.expandByPoint(voxel.position)
    })
    return box
  }, [voxelDataPerModel, activeModel])

  // Viewport налаштування прибрано - воно обрізало видимість моделі
  // Модель позиціонується через масштабування та центрування без обмеження viewport

  // Масштабування та позиціонування моделі на основі розмірів та позиції models_wrapper
  useEffect(() => {
    if (
      !groupRef.current ||
      !currentModelBoundingBox ||
      !modelsWrapperHeight ||
      !modelsWrapperWidth ||
      modelsWrapperX === null ||
      modelsWrapperY === null ||
      !camera ||
      !size
    )
      return

    const box = currentModelBoundingBox
    const modelSize = box.getSize(new THREE.Vector3())
    const modelCenter = box.getCenter(new THREE.Vector3())

    // Отримуємо відстань від камери до центру моделі
    const cameraDistance = camera.position.length()

    // Обчислюємо aspect ratio Canvas та models_wrapper
    const canvasAspect = size.width / size.height
    const wrapperAspect = modelsWrapperWidth / modelsWrapperHeight

    // Перевіряємо тип камери та отримуємо FOV
    let canvasVisibleHeight: number
    let canvasVisibleWidth: number

    if (camera instanceof THREE.PerspectiveCamera) {
      // FOV камери в радіанах
      const fovRad = (camera.fov * Math.PI) / 180

      // Обчислюємо висоту видимої області всього Canvas на відстані cameraDistance
      // Формула: height = 2 * distance * tan(fov/2)
      canvasVisibleHeight = 2 * cameraDistance * Math.tan(fovRad / 2)
      canvasVisibleWidth = canvasVisibleHeight * canvasAspect
    } else {
      // Для OrthographicCamera використовуємо розміри Canvas напряму
      canvasVisibleHeight = size.height
      canvasVisibleWidth = size.width
    }

    // Обчислюємо видиму область для models_wrapper на Canvas
    // Частка розміру models_wrapper відносно Canvas
    const wrapperWidthRatio = modelsWrapperWidth / size.width
    const wrapperHeightRatio = modelsWrapperHeight / size.height

    // Видима область для models_wrapper в 3D просторі
    const wrapperVisibleWidth = canvasVisibleWidth * wrapperWidthRatio
    const wrapperVisibleHeight = canvasVisibleHeight * wrapperHeightRatio

    // Обчислюємо масштаб на основі розмірів models_wrapper
    const scaleFactor = 0.7
    const targetHeight = wrapperVisibleHeight * scaleFactor
    const targetWidth = wrapperVisibleWidth * scaleFactor

    // Обчислюємо масштаб на основі обох розмірів (вибираємо менший, щоб модель вмістилася)
    const scaleByHeight = targetHeight / modelSize.y
    const scaleByWidth = targetWidth / modelSize.x
    const finalScale = Math.min(scaleByHeight, scaleByWidth)

    // Застосовуємо масштаб
    groupRef.current.scale.set(finalScale, finalScale, finalScale)

    // Обчислюємо позицію models_wrapper відносно центру Canvas
    // Canvas центр: (0, 0) в 3D просторі відповідає центру Canvas
    // models_wrapper центр на Canvas: (modelsWrapperX + modelsWrapperWidth/2, modelsWrapperY + modelsWrapperHeight/2)
    // Перетворюємо координати Canvas в 3D координати

    const canvasCenterX = size.width / 2
    const canvasCenterY = size.height / 2
    const wrapperCenterX = modelsWrapperX + modelsWrapperWidth / 2
    const wrapperCenterY = modelsWrapperY + modelsWrapperHeight / 2

    // Нормалізуємо координати відносно центру Canvas (-1 до 1)
    const normalizedX = ((wrapperCenterX - canvasCenterX) / size.width) * 2
    const normalizedY = ((canvasCenterY - wrapperCenterY) / size.height) * 2 // Y інвертований

    // Перетворюємо нормалізовані координати в 3D простір
    // Використовуємо видиму ширину та висоту всього Canvas для перетворення
    const positionX = normalizedX * (canvasVisibleWidth / 2)
    const positionY = normalizedY * (canvasVisibleHeight / 2)

    // Центруємо модель та позиціонуємо її в правильному місці
    const scaledCenter = modelCenter.clone().multiplyScalar(finalScale)
    groupRef.current.position.set(
      positionX - scaledCenter.x,
      positionY - scaledCenter.y,
      -scaledCenter.z,
    )
  }, [
    currentModelBoundingBox,
    modelsWrapperHeight,
    modelsWrapperWidth,
    modelsWrapperX,
    modelsWrapperY,
    activeModel,
    camera,
    size,
  ])

  // старт ініціалізації першої моделі
  useEffect(() => {
    switchToModel(activeModel)
  }, [switchToModel, activeModel])

  return (
    <group ref={groupRef} onClick={() => setActiveModel(1)}>
      <mesh ref={meshRef} geometry={geometry}>
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  )
}
