'use client'

import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import {
  float,
  vec3,
  mix,
  smoothstep,
  attribute,
  uniform,
  positionLocal,
  texture,
  normalView,
} from 'three/tsl'
import { useEffect, useRef, useCallback, useMemo } from 'react'
import { MeshStandardNodeMaterial } from 'three/webgpu'
import * as THREE from 'three'
import gsap from 'gsap'

import { useModel } from '@store'

import servicesData from './data/services.json'
import aboutData from './data/about.json'
import logoData from './data/logo.json'

// Types
type Voxel = {
  position: THREE.Vector3
}

type VoxelModelData = Voxel[]

// Кількість воекселів
const FIXED_INSTANCE_COUNT = 20000
const HIDDEN_POSITION = new THREE.Vector3(0, -1000, 0)

// Параметри воекселів
const params = {
  boxSize: 0.18,
  boxRoundness: 0.03,
}

const TEXTURE_PATH = '/texture/voxel/white.png'

export const Voxels = () => {
  const { activeModel, setActiveModel } = useModel()

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
    const baseColor = vec3(254.0 / 255.0, 197.0 / 255.0, 50.0 / 255.0)
    const finalColor = matcapColor.rgb.mul(baseColor)

    m.colorNode = finalColor

    return m
  }, [uProgress, voxelTexture])

  // Обробка даних при ініціалізації
  const voxelDataPerModel = useMemo(() => {
    const rawData = [aboutData, logoData, servicesData]
    return rawData.map((data) =>
      data.map((item: any) => ({
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
