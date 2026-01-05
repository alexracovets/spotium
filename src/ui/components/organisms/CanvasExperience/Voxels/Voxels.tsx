'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import gsap from 'gsap'
// @ts-ignore
import { MeshStandardNodeMaterial } from 'three/webgpu'
import {
  float,
  vec3,
  mix,
  smoothstep,
  attribute,
  uniform,
  positionLocal,
  instanceIndex,
  hash,
} from 'three/tsl'

// Types
type Voxel = {
  position: THREE.Vector3
  color: THREE.Color
}

type VoxelModelData = Voxel[]

// Constants
const FIXED_INSTANCE_COUNT = 15000
const HIDDEN_POSITION = new THREE.Vector3(0, -1000, 0)

// Parameters
const params = {
  modelSize: 10,
  gridSize: 0.2,
  boxSize: 0.18,
  boxRoundness: 0.05,
  rotationInterval: 5000,
}

export const Voxels = () => {
  const models = useMemo(
    () => ['./models/about.gltf', './models/logo.glb', './models/services.gltf'],
    [],
  )

  // State
  const [loadedModelsCount, setLoadedModelsCount] = useState<number>(0)
  // Removed isReady state as we will ensure geometry is ready immediately

  // Refs
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const voxelDataPerModelRef = useRef<VoxelModelData[]>([])
  const rayCasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const groupRef = useRef<THREE.Group>(null)

  // Animation state
  const currentModelIdxRef = useRef<number>(0)
  const isAnimatingRef = useRef<boolean>(false)

  // Geometry Setup
  const geometry = useMemo(() => {
    const geo = new THREE.InstancedBufferGeometry()

    // Base geometry is a rounded box
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

    // Instanced attributes
    const aPositionStart = new Float32Array(FIXED_INSTANCE_COUNT * 3)
    const aPositionEnd = new Float32Array(FIXED_INSTANCE_COUNT * 3)
    const aColorStart = new Float32Array(FIXED_INSTANCE_COUNT * 3)
    const aColorEnd = new Float32Array(FIXED_INSTANCE_COUNT * 3)
    // Packed: x = scaleStart, y = scaleEnd, z = random
    const aMisc = new Float32Array(FIXED_INSTANCE_COUNT * 3)

    for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
      const idx3 = i * 3

      // Misc: scaleStart, scaleEnd, random
      aMisc[idx3] = 0 // scaleStart
      aMisc[idx3 + 1] = 0 // scaleEnd
      aMisc[idx3 + 2] = Math.random() // random

      aPositionStart[idx3] = HIDDEN_POSITION.x
      aPositionStart[idx3 + 1] = HIDDEN_POSITION.y
      aPositionStart[idx3 + 2] = HIDDEN_POSITION.z

      aPositionEnd[idx3] = HIDDEN_POSITION.x
      aPositionEnd[idx3 + 1] = HIDDEN_POSITION.y
      aPositionEnd[idx3 + 2] = HIDDEN_POSITION.z
    }

    geo.setAttribute('aPositionStart', new THREE.InstancedBufferAttribute(aPositionStart, 3))
    geo.setAttribute('aPositionEnd', new THREE.InstancedBufferAttribute(aPositionEnd, 3))
    geo.setAttribute('aColorStart', new THREE.InstancedBufferAttribute(aColorStart, 3))
    geo.setAttribute('aColorEnd', new THREE.InstancedBufferAttribute(aColorEnd, 3))
    geo.setAttribute('aMisc', new THREE.InstancedBufferAttribute(aMisc, 3))

    geo.instanceCount = FIXED_INSTANCE_COUNT

    return geo
  }, [])

  // TSL Setup
  const uProgress = useMemo(() => uniform(0), [])

  const material = useMemo(() => {
    const m = new MeshStandardNodeMaterial()

    // Attributes
    const aPositionStart = attribute('aPositionStart', 'vec3')
    const aPositionEnd = attribute('aPositionEnd', 'vec3')
    const aColorStart = attribute('aColorStart', 'vec3')
    const aColorEnd = attribute('aColorEnd', 'vec3')
    const aMisc = attribute('aMisc', 'vec3')

    // Unpack Misc
    const aScaleStart = aMisc.x
    const aScaleEnd = aMisc.y
    const aRandom = aMisc.z

    // Logic
    const duration = float(0.6)
    const delay = aRandom.mul(0.4)

    // Map uProgress (0..1) to local progress (0..1)
    const t = smoothstep(delay, delay.add(duration), uProgress)

    // Easing (Back Out)
    const s = float(1.70158)
    const tMinus1 = t.sub(1.0)
    const easedT = tMinus1
      .mul(tMinus1)
      .mul(tMinus1.mul(s.add(1.0)).add(s))
      .add(1.0)

    // Interpolate position
    const pos = mix(aPositionStart, aPositionEnd, easedT)

    // Interpolate scale
    const scale = mix(aScaleStart, aScaleEnd, t)

    // Interpolate color
    const colorT = smoothstep(delay.add(duration.mul(0.5)), delay.add(duration), uProgress)
    const color = mix(aColorStart, aColorEnd, colorT)

    // Apply position and scale
    m.positionNode = pos.add(positionLocal.mul(scale))
    m.colorNode = vec3(color)

    return m
  }, [uProgress])

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

      return modelVoxels.slice(0, FIXED_INSTANCE_COUNT)
    },
    [],
  )

  // Switch to model
  const switchToModel = useCallback(
    (newModelIdx: number) => {
      // geometry is now in scope from useMemo, but we need to access it.
      // Since it's stable, we can use it directly.

      const targetData = voxelDataPerModelRef.current[newModelIdx]
      if (!targetData) return

      isAnimatingRef.current = true

      // Note: When using mesh + instancedBufferGeometry, we don't need to cast to InstancedBufferAttribute if we know the structure,
      // but for type safety we can keep it.
      const attrPosStart = geometry.attributes.aPositionStart as THREE.InstancedBufferAttribute
      const attrPosEnd = geometry.attributes.aPositionEnd as THREE.InstancedBufferAttribute
      const attrColorStart = geometry.attributes.aColorStart as THREE.InstancedBufferAttribute
      const attrColorEnd = geometry.attributes.aColorEnd as THREE.InstancedBufferAttribute
      const attrMisc = geometry.attributes.aMisc as THREE.InstancedBufferAttribute

      // 1. Copy End to Start
      attrPosStart.array.set(attrPosEnd.array)
      attrColorStart.array.set(attrColorEnd.array)

      // Copy scaleEnd (y) to scaleStart (x) in Misc
      const miscArray = attrMisc.array as Float32Array
      for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
        const idx3 = i * 3
        miscArray[idx3] = miscArray[idx3 + 1] // scaleStart = scaleEnd
      }

      // 2. Set new End state
      const posEndArray = attrPosEnd.array as Float32Array
      const colorEndArray = attrColorEnd.array as Float32Array

      for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
        const idx3 = i * 3

        if (i < targetData.length) {
          const voxel = targetData[i]
          posEndArray[idx3] = voxel.position.x
          posEndArray[idx3 + 1] = voxel.position.y
          posEndArray[idx3 + 2] = voxel.position.z

          colorEndArray[idx3] = voxel.color.r
          colorEndArray[idx3 + 1] = voxel.color.g
          colorEndArray[idx3 + 2] = voxel.color.b

          miscArray[idx3 + 1] = 1.0 // scaleEnd = 1.0
        } else {
          // Hide unused voxels
          posEndArray[idx3] = HIDDEN_POSITION.x
          posEndArray[idx3 + 1] = HIDDEN_POSITION.y
          posEndArray[idx3 + 2] = HIDDEN_POSITION.z

          miscArray[idx3 + 1] = 0.0 // scaleEnd = 0.0
        }
      }

      // Mark attributes as needing update
      attrPosStart.needsUpdate = true
      attrPosEnd.needsUpdate = true
      attrColorStart.needsUpdate = true
      attrColorEnd.needsUpdate = true
      attrMisc.needsUpdate = true

      // 3. Animate uProgress
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

      // Rotate the group slightly for effect
      if (groupRef.current) {
        gsap.to(groupRef.current.rotation, {
          y: groupRef.current.rotation.y + Math.PI * 0.5,
          duration: 2,
          ease: 'power2.out',
        })
      }

      currentModelIdxRef.current = newModelIdx
    },
    [uProgress, geometry],
  )

  // Load models
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

  // Initialize and start
  useEffect(() => {
    if (loadedModelsCount !== models.length) return

    console.log('All instances gathered')

    // Initial model show
    switchToModel(0)

    // Start rotation interval
    const interval = setInterval(() => {
      const nextIdx = (currentModelIdxRef.current + 1) % models.length
      switchToModel(nextIdx)
    }, params.rotationInterval)

    return () => clearInterval(interval)
  }, [loadedModelsCount, models.length, switchToModel])

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} geometry={geometry}>
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  )
}
