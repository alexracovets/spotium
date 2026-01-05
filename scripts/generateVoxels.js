// Скрипт для генерації JSON файлів з вокселями
// Запустіть: node scripts/generateVoxels.js

import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Параметри (копія з Voxels.tsx)
const params = {
  modelSize: 10,
  gridSize: 0.18,
}

const FIXED_INSTANCE_COUNT = 20000

// Функція ray casting
const isInsideMesh = (pos, ray, mesh, rayCaster) => {
  rayCaster.set(pos, ray)
  const intersects = rayCaster.intersectObject(mesh, false)
  return intersects.length % 2 === 1
}

// Функція voxelізації
const voxelizeModel = (scene, rayCaster) => {
  const importedMeshes = []
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.side = THREE.DoubleSide
      importedMeshes.push(child)
    }
  })

  let boundingBox = new THREE.Box3().setFromObject(scene)
  const size = boundingBox.getSize(new THREE.Vector3())
  const scaleFactor = params.modelSize / size.length()
  const center = boundingBox.getCenter(new THREE.Vector3()).multiplyScalar(-scaleFactor)

  scene.scale.multiplyScalar(scaleFactor)
  scene.position.copy(center)

  boundingBox = new THREE.Box3().setFromObject(scene)
  boundingBox.min.y += 0.5 * params.gridSize

  const modelVoxels = []

  for (let i = boundingBox.min.x; i < boundingBox.max.x; i += params.gridSize) {
    for (let j = boundingBox.min.y; j < boundingBox.max.y; j += params.gridSize) {
      for (let k = boundingBox.min.z; k < boundingBox.max.z; k += params.gridSize) {
        for (let meshCnt = 0; meshCnt < importedMeshes.length; meshCnt++) {
          const mesh = importedMeshes[meshCnt]
          const pos = new THREE.Vector3(i, j, k)

          if (isInsideMesh(pos, new THREE.Vector3(0, 0, 1), mesh, rayCaster)) {
            modelVoxels.push({
              position: { x: pos.x, y: pos.y, z: pos.z },
            })
            break
          }
        }
      }
    }
  }

  return modelVoxels.slice(0, FIXED_INSTANCE_COUNT)
}

// Головна функція
const generateVoxelData = async () => {
  const models = [
    { file: './public/models/about.glb', output: 'about.json' },
    { file: './public/models/logo.glb', output: 'logo.json' },
    { file: './public/models/services.glb', output: 'services.json' },
  ]

  const loader = new GLTFLoader()
  const rayCaster = new THREE.Raycaster()

  for (const model of models) {
    console.log(`Обробка ${model.file}...`)

    try {
      const gltf = await new Promise((resolve, reject) => {
        loader.load(model.file, resolve, undefined, reject)
      })

      const voxelData = voxelizeModel(gltf.scene, rayCaster)
      console.log(`  Знайдено ${voxelData.length} вокселів`)

      const outputPath = path.join(__dirname, '..', 'public', 'voxels', model.output)
      fs.writeFileSync(outputPath, JSON.stringify(voxelData, null, 2))
      console.log(`  Збережено в ${outputPath}`)
    } catch (error) {
      console.error(`  Помилка: ${error.message}`)
    }
  }

  console.log('Готово!')
}

generateVoxelData()
