'use client'

import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { float, vec3, mix, smoothstep, attribute, uniform, positionLocal } from 'three/tsl'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshStandardNodeMaterial } from 'three/webgpu'
import * as THREE from 'three'
import gsap from 'gsap'

// Types
type Voxel = {
  position: THREE.Vector3
}

type VoxelModelData = Voxel[]

// Кількість воекселів
const FIXED_INSTANCE_COUNT = 15000
const HIDDEN_POSITION = new THREE.Vector3(0, -1000, 0)

// Параметри воекселів
const params = {
  modelSize: 10,
  gridSize: 0.2,
  boxSize: 0.18,
  boxRoundness: 0.03,
  rotationInterval: 5000,
}

export const Voxels = () => {
  const models = useMemo(
    () => ['./models/about.gltf', './models/logo.glb', './models/services.gltf'],
    [],
  )

  // Скоуп моделей
  const [loadedModelsCount, setLoadedModelsCount] = useState<number>(0)

  const meshRef = useRef<THREE.InstancedMesh>(null)
  const voxelDataPerModelRef = useRef<VoxelModelData[]>([])
  const rayCasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
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

    // Фіксований колір
    const color = vec3(254.0 / 255.0, 197.0 / 255.0, 50.0 / 255.0)

    // Застосування позиції та масштабу
    m.positionNode = pos.add(positionLocal.mul(scale))
    m.colorNode = color

    return m
  }, [uProgress])

  // Функція допомоги: Перевірка чи точка знаходиться всередині меша
  const isInsideMesh = (
    pos: THREE.Vector3,
    ray: THREE.Vector3,
    mesh: THREE.Mesh,
    rayCaster: THREE.Raycaster,
  ): boolean => {
    rayCaster.set(pos, ray)
    const intersects = rayCaster.intersectObject(mesh, false)
    return intersects.length % 2 === 1
  }

  // Функція допомоги: Вoxelізація моделі
  const voxelizeModel = useCallback(
    (scene: THREE.Group, rayCaster: THREE.Raycaster): VoxelModelData => {
      const importedMeshes: THREE.Mesh[] = []
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.side = THREE.DoubleSide
          importedMeshes.push(child)
        }
      })

      // Обчислення коробки обмежень та масштабування моделі
      let boundingBox = new THREE.Box3().setFromObject(scene)
      const size = boundingBox.getSize(new THREE.Vector3())
      const scaleFactor = params.modelSize / size.length()
      const center = boundingBox.getCenter(new THREE.Vector3()).multiplyScalar(-scaleFactor)

      scene.scale.multiplyScalar(scaleFactor)
      scene.position.copy(center)

      boundingBox = new THREE.Box3().setFromObject(scene)
      boundingBox.min.y += 0.5 * params.gridSize

      const modelVoxels: Voxel[] = []

      // Обрахунок
      for (let i = boundingBox.min.x; i < boundingBox.max.x; i += params.gridSize) {
        for (let j = boundingBox.min.y; j < boundingBox.max.y; j += params.gridSize) {
          for (let k = boundingBox.min.z; k < boundingBox.max.z; k += params.gridSize) {
            for (let meshCnt = 0; meshCnt < importedMeshes.length; meshCnt++) {
              const mesh = importedMeshes[meshCnt]

              const pos = new THREE.Vector3(i, j, k)

              if (isInsideMesh(pos, new THREE.Vector3(0, 0, 1), mesh, rayCaster)) {
                modelVoxels.push({ position: pos })
                break
              }
            }
          }
        }
      }

      return modelVoxels.slice(0, FIXED_INSTANCE_COUNT)
    },
    [],
  )

  // Перемикання моделей
  const switchToModel = useCallback(
    (newModelIdx: number) => {
      // обираєсо модель для відмалювання
      const targetData = voxelDataPerModelRef.current[newModelIdx]
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
    [uProgress, geometry],
  )

  // завантаження моделей
  useEffect(() => {
    const loader = new GLTFLoader()
    const rayCaster = rayCasterRef.current

    const loadModelsSequentially = async () => {
      for (let modelIdx = 0; modelIdx < models.length; modelIdx++) {
        await new Promise<void>((resolve) => {
          loader.load(
            models[modelIdx],
            (gltf) => {
              const voxelData = voxelizeModel(gltf.scene, rayCaster)
              voxelDataPerModelRef.current[modelIdx] = voxelData
              setLoadedModelsCount((prev) => prev + 1)
              resolve()
            },
            undefined,
            (error) => {
              console.error('Error loading model:', error)
              resolve()
            },
          )
        })
      }
    }

    loadModelsSequentially()
  }, [models, voxelizeModel])

  // старт ініціалізації першої моделі
  useEffect(() => {
    if (loadedModelsCount !== models.length) return
    // завантаження всіх моделей
    console.log('All instances gathered')

    // ініціалізація першої моделі
    switchToModel(0)
  }, [loadedModelsCount, models.length, switchToModel])

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geometry}>
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  )
}
