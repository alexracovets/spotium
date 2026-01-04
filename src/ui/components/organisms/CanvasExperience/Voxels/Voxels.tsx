'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import gsap from 'gsap'

// Types
type Voxel = {
  position: THREE.Vector3
  color: THREE.Color
}

type VoxelModelData = Voxel[]

// Constants
const FIXED_INSTANCE_COUNT = 5000
const HIDDEN_POSITION = new THREE.Vector3(0, -1000, 0)

// Parameters
const params = {
  modelSize: 10,
  gridSize: 0.35,
  boxSize: 0.35,
  boxRoundness: 0.03,
  rotationInterval: 5000,
}

export const Voxels = () => {
  const models = useMemo(
    () => [
      './models/logo_13x86x55.glb',
      './models/about_48x48x48.glb',
      './models/servises_27x24x28.glb',
    ],
    [],
  )

  // State
  const [loadedModelsCount, setLoadedModelsCount] = useState<number>(0)

  // Refs for Three.js objects
  const instancedMeshRef = useRef<THREE.InstancedMesh | null>(null)
  const voxelDataPerModelRef = useRef<VoxelModelData[]>([])
  const currentVoxelsRef = useRef<Voxel[]>([])
  const dummyRef = useRef<THREE.Object3D>(new THREE.Object3D())
  const rayCasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const groupRef = useRef<THREE.Group>(null)

  // Animation state refs
  const isAnimatingRef = useRef<boolean>(false)
  const voxelsToUpdateRef = useRef<Set<number>>(new Set())

  // Helper function: Check if a point is inside a mesh using ray casting
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

  // Helper function: Voxelize a single model
  const voxelizeModel = useCallback(
    (scene: THREE.Group, rayCaster: THREE.Raycaster): VoxelModelData => {
      const importedMeshes: THREE.Mesh[] = []
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.side = THREE.DoubleSide
          importedMeshes.push(child)
        }
      })

      // Calculate bounding box and scale model
      let boundingBox = new THREE.Box3().setFromObject(scene)
      const size = boundingBox.getSize(new THREE.Vector3())
      const scaleFactor = params.modelSize / size.length()
      const center = boundingBox.getCenter(new THREE.Vector3()).multiplyScalar(-scaleFactor)

      scene.scale.multiplyScalar(scaleFactor)
      scene.position.copy(center)

      boundingBox = new THREE.Box3().setFromObject(scene)
      boundingBox.min.y += 0.5 * params.gridSize

      const modelVoxels: Voxel[] = []

      // Grid sampling
      for (let i = boundingBox.min.x; i < boundingBox.max.x; i += params.gridSize) {
        for (let j = boundingBox.min.y; j < boundingBox.max.y; j += params.gridSize) {
          for (let k = boundingBox.min.z; k < boundingBox.max.z; k += params.gridSize) {
            for (let meshCnt = 0; meshCnt < importedMeshes.length; meshCnt++) {
              const mesh = importedMeshes[meshCnt]

              const material = mesh.material as THREE.MeshStandardMaterial
              const hslColor = { h: 0, s: 0, l: 0 }
              material.color.getHSL(hslColor)
              const color = new THREE.Color().setHSL(
                hslColor.h,
                hslColor.s * 0.8,
                hslColor.l * 0.8 + 0.2,
              )
              const pos = new THREE.Vector3(i, j, k)

              if (isInsideMesh(pos, new THREE.Vector3(0, 0, 1), mesh, rayCaster)) {
                modelVoxels.push({ color: color, position: pos })
                break
              }
            }
          }
        }
      }

      // Обмежуємо до FIXED_INSTANCE_COUNT
      return modelVoxels.slice(0, FIXED_INSTANCE_COUNT)
    },
    [],
  )

  // Helper function: Create fixed instanced mesh (один раз!)
  const createFixedInstancedMesh = useCallback(() => {
    const voxelGeometry = new RoundedBoxGeometry(
      params.boxSize,
      params.boxSize,
      params.boxSize,
      2,
      params.boxRoundness,
    )
    const voxelMaterial = new THREE.MeshLambertMaterial({})
    const mesh = new THREE.InstancedMesh(voxelGeometry, voxelMaterial, FIXED_INSTANCE_COUNT)
    mesh.castShadow = true
    mesh.receiveShadow = true

    const dummy = dummyRef.current
    const firstModelData = voxelDataPerModelRef.current[0]

    // Ініціалізація currentVoxels
    currentVoxelsRef.current = []

    // Ініціалізація з першої моделі
    for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
      if (i < firstModelData.length) {
        // Використати дані з моделі 0
        const voxel = firstModelData[i]
        currentVoxelsRef.current.push({
          position: voxel.position.clone(),
          color: voxel.color.clone(),
        })
        mesh.setColorAt(i, voxel.color)
        dummy.position.copy(voxel.position)
        dummy.scale.set(1, 1, 1)
      } else {
        // Сховати зайві воксель
        currentVoxelsRef.current.push({
          position: HIDDEN_POSITION.clone(),
          color: new THREE.Color(0x000000),
        })
        mesh.setColorAt(i, new THREE.Color(0x000000))
        dummy.position.copy(HIDDEN_POSITION)
        dummy.scale.set(0, 0, 0)
      }
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true
    }

    return mesh
  }, [])

  // Helper function: Switch to model with animation
  const switchToModel = useCallback((newModelIdx: number) => {
    const targetData = voxelDataPerModelRef.current[newModelIdx]
    const currentVoxels = currentVoxelsRef.current

    if (!targetData || !currentVoxels.length) return

    // Set animation flag
    isAnimatingRef.current = true
    voxelsToUpdateRef.current.clear()

    // Анімуємо всі 5000 інстансів
    for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
      // Kill existing tweens
      gsap.killTweensOf(currentVoxels[i].color)
      gsap.killTweensOf(currentVoxels[i].position)

      const delay = 0.2 * Math.random()
      const duration = 0.5 + 0.5 * Math.pow(Math.random(), 6)

      if (i < targetData.length) {
        // Анімувати до нової позиції/кольору
        gsap.to(currentVoxels[i].position, {
          x: targetData[i].position.x,
          y: targetData[i].position.y,
          z: targetData[i].position.z,
          delay,
          duration,
          ease: 'back.out(2)',
          onUpdate: () => {
            voxelsToUpdateRef.current.add(i)
          },
          onComplete:
            i === 0
              ? () => {
                  isAnimatingRef.current = false
                }
              : undefined,
        })

        gsap.to(currentVoxels[i].color, {
          r: targetData[i].color.r,
          g: targetData[i].color.g,
          b: targetData[i].color.b,
          delay: delay + duration * 0.7,
          duration: 0.3,
          ease: 'power1.in',
          onUpdate: () => {
            voxelsToUpdateRef.current.add(i)
          },
        })
      } else {
        // Сховати зайвий воксель
        gsap.to(currentVoxels[i].position, {
          x: HIDDEN_POSITION.x,
          y: HIDDEN_POSITION.y,
          z: HIDDEN_POSITION.z,
          delay,
          duration: 0.5,
          onUpdate: () => {
            voxelsToUpdateRef.current.add(i)
          },
        })
      }
    }

    // Increase the model rotation during transition
    const mesh = instancedMeshRef.current
    if (mesh) {
      gsap.to(mesh.rotation, {
        duration: 1.2,
        y: '+=' + 1.3 * Math.PI,
        ease: 'power2.out',
      })
    }
  }, [])

  // Load models and voxelize them
  useEffect(() => {
    if (!groupRef.current) return

    const loader = new GLTFLoader()
    const rayCaster = rayCasterRef.current

    // Завантажуємо моделі асинхронно
    const loadModelsSequentially = async () => {
      for (let modelIdx = 0; modelIdx < models.length; modelIdx++) {
        await new Promise<void>((resolve) => {
          loader.load(
            models[modelIdx],
            (gltf) => {
              // Виконуємо вокселізацію асинхронно через setTimeout
              setTimeout(() => {
                const voxelData = voxelizeModel(gltf.scene, rayCaster)
                voxelDataPerModelRef.current[modelIdx] = voxelData

                setLoadedModelsCount((prev) => prev + 1)

                resolve()
              }, 0)
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

  // Create mesh after all models are loaded
  useEffect(() => {
    if (loadedModelsCount !== models.length || !groupRef.current) return
    if (instancedMeshRef.current) return // Вже створений

    // Створюємо mesh один раз після завантаження всіх моделей
    const mesh = createFixedInstancedMesh()
    instancedMeshRef.current = mesh
    groupRef.current.add(mesh)
  }, [loadedModelsCount, models.length, createFixedInstancedMesh])

  // Auto-rotation effect
  useEffect(() => {
    if (loadedModelsCount < models.length) return
    if (!instancedMeshRef.current) return

    let currentIdx = 0
    const interval = setInterval(() => {
      const newIdx = (currentIdx + 1) % models.length
      switchToModel(newIdx)
      currentIdx = newIdx
    }, params.rotationInterval)

    return () => clearInterval(interval)
  }, [loadedModelsCount, models.length, switchToModel])

  // useFrame for smooth updates during animations - ОПТИМІЗОВАНО
  useFrame(() => {
    const instancedMesh = instancedMeshRef.current
    const currentVoxels = currentVoxelsRef.current
    const dummy = dummyRef.current

    if (!instancedMesh || !isAnimatingRef.current) return
    if (voxelsToUpdateRef.current.size === 0) return

    // Оновлюємо тільки воксель, які змінилися (батчінг)
    const voxelsToUpdate = Array.from(voxelsToUpdateRef.current)

    // Обробляємо всі воксель що в черзі
    for (const i of voxelsToUpdate) {
      if (i >= currentVoxels.length) continue

      // Update color
      instancedMesh.setColorAt(i, currentVoxels[i].color)

      // Update position/matrix
      dummy.position.copy(currentVoxels[i].position)
      dummy.updateMatrix()
      instancedMesh.setMatrixAt(i, dummy.matrix)

      // Видаляємо з черги
      voxelsToUpdateRef.current.delete(i)
    }

    // Mark for GPU update
    if (instancedMesh.instanceColor) {
      instancedMesh.instanceColor.needsUpdate = true
    }
    instancedMesh.instanceMatrix.needsUpdate = true
  })

  return (
    <group ref={groupRef}>
      {/* Shadow plane */}
      <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[35, 35]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
    </group>
  )
}
