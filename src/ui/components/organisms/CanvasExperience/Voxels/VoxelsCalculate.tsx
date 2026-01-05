import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useEffect, useState, useRef, useCallback } from 'react'
import * as THREE from 'three'

// Types
type Voxel = {
  position: THREE.Vector3
}

type VoxelModelData = Voxel[]

// Тип для GLTF, який повертає GLTFLoader
type GLTF = {
  scene: THREE.Group
  scenes: THREE.Group[]
  cameras: THREE.Camera[]
  animations: THREE.AnimationClip[]
  asset: Record<string, unknown>
  parser: unknown
  userData: Record<string, unknown>
}

// Параметри воекселів
const params = {
  modelSize: 10,
  gridSize: 0.18,
}

const FIXED_INSTANCE_COUNT = 20000

export const VoxelsCalculate = () => {
  const [status, setStatus] = useState('Ініціалізація...')
  const rayCasterRef = useRef(new THREE.Raycaster())

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

  // Функція допомоги: Вoxelізація моделі (chunked)
  const voxelizeModelChunked = useCallback(
    (
      scene: THREE.Group,
      rayCaster: THREE.Raycaster,
      onProgress?: (progress: number) => void,
    ): Promise<VoxelModelData> => {
      return new Promise((resolve) => {
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

        // Створюємо масив всіх точок для перевірки
        const points: THREE.Vector3[] = []
        for (let i = boundingBox.min.x; i < boundingBox.max.x; i += params.gridSize) {
          for (let j = boundingBox.min.y; j < boundingBox.max.y; j += params.gridSize) {
            for (let k = boundingBox.min.z; k < boundingBox.max.z; k += params.gridSize) {
              points.push(new THREE.Vector3(i, j, k))
            }
          }
        }

        const totalPoints = points.length
        console.log(
          `📊 Всього точок для перевірки: ${totalPoints}, meshes: ${importedMeshes.length}`,
        )
        const CHUNK_SIZE = 100
        let currentIndex = 0

        const processChunk = () => {
          const endIndex = Math.min(currentIndex + CHUNK_SIZE, totalPoints)

          for (let idx = currentIndex; idx < endIndex; idx++) {
            const pos = points[idx]

            for (let meshCnt = 0; meshCnt < importedMeshes.length; meshCnt++) {
              const mesh = importedMeshes[meshCnt]

              if (isInsideMesh(pos, new THREE.Vector3(0, 0, 1), mesh, rayCaster)) {
                modelVoxels.push({ position: pos })
                break
              }
            }
          }

          currentIndex = endIndex

          // Оновлюємо прогрес
          if (onProgress) {
            onProgress((currentIndex / totalPoints) * 100)
          }

          // Якщо ще є точки для обробки, продовжуємо
          if (currentIndex < totalPoints) {
            requestAnimationFrame(processChunk)
          } else {
            // Завершено
            const finalVoxels = modelVoxels.slice(0, FIXED_INSTANCE_COUNT)
            resolve(finalVoxels)
          }
        }

        // Запускаємо обробку
        requestAnimationFrame(processChunk)
      })
    },
    [],
  )

  useEffect(() => {
    const generateAll = async () => {
      const models = [
        { file: './models/about.glb', name: 'about' },
        { file: './models/logo.glb', name: 'logo' },
        { file: './models/services.glb', name: 'services' },
      ]

      const loader = new GLTFLoader()
      const rayCaster = rayCasterRef.current

      for (let i = 0; i < models.length; i++) {
        const model = models[i]
        setStatus(`Обробка ${model.name} (${i + 1}/${models.length})...`)

        try {
          const gltf = await new Promise<GLTF>((resolve, reject) => {
            loader.load(model.file, resolve, undefined, reject)
          })

          const voxelData = await voxelizeModelChunked(gltf.scene, rayCaster, (progress) => {
            setStatus(`Обробка ${model.name}: ${progress.toFixed(1)}%`)
          })

          const jsonData = JSON.stringify(
            voxelData.map((v) => ({
              position: { x: v.position.x, y: v.position.y, z: v.position.z },
            })),
            null,
            2,
          )

          // Завантажити файл
          const blob = new Blob([jsonData], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${model.name}.json`
          a.click()
          URL.revokeObjectURL(url)

          console.log(`✅ ${model.name}.json збережено`)
        } catch (error: unknown) {
          console.error(`❌ Помилка ${model.name}:`, error)
          const errorMessage = error instanceof Error ? error.message : 'Невідома помилка'
          setStatus(`Помилка: ${errorMessage}`)
        }
      }

      setStatus('Готово! Всі файли збережено.')
    }

    generateAll()
  }, [voxelizeModelChunked])

  useEffect(() => {
    console.log(status)
  }, [status])

  return (
    <group>
      {/* Можна додати візуалізацію процесу, наприклад текст в 3D */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="red" wireframe />
      </mesh>
    </group>
  )
}
