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

// Shaders
const vertexShader = `
  attribute vec3 aPositionStart;
  attribute vec3 aPositionEnd;
  attribute vec3 aColorStart;
  attribute vec3 aColorEnd;
  attribute float aScaleStart;
  attribute float aScaleEnd;
  attribute float aRandom;

  uniform float uProgress;
  uniform float uTime;
  
  varying vec3 vColor;
  varying vec3 vNormal;

  // Easing function (Back Out)
  float backOut(float t) {
    float s = 1.70158;
    return --t * t * ((s + 1.0) * t + s) + 1.0;
  }

  void main() {
    // Calculate local progress based on randomness
    // Delay is based on aRandom (0.0 to 1.0)
    // We want the animation to take part of the total time, shifted by delay
    
    float duration = 0.6; // Duration of individual particle animation relative to total time
    float delay = aRandom * 0.4; // Max delay
    
    // Map uProgress (0..1) to local progress (0..1)
    float t = smoothstep(delay, delay + duration, uProgress);
    
    // Apply easing
    float easedT = backOut(t);
    
    // Interpolate position
    vec3 pos = mix(aPositionStart, aPositionEnd, easedT);
    
    // Interpolate scale
    // We want scale to go to 0 if end scale is 0 (hidden)
    float scale = mix(aScaleStart, aScaleEnd, t); // Linear scale for smoothness
    
    // Interpolate color
    // Color transition happens slightly later
    float colorT = smoothstep(delay + duration * 0.5, delay + duration, uProgress);
    vColor = mix(aColorStart, aColorEnd, colorT);
    
    vNormal = normal;

    // Apply instance transform
    vec3 transformed = position * scale;
    
    // Standard Three.js vertex transform
    vec4 mvPosition = modelViewMatrix * vec4(pos + transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  varying vec3 vColor;
  varying vec3 vNormal;

  void main() {
    // Simple lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Ambient + Diffuse
    vec3 lighting = vec3(0.4) + vec3(0.6) * diff;
    
    gl_FragColor = vec4(vColor * lighting, 1.0);
  }
`

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

  // Refs
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const geometryRef = useRef<THREE.InstancedBufferGeometry>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const voxelDataPerModelRef = useRef<VoxelModelData[]>([])
  const rayCasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const groupRef = useRef<THREE.Group>(null)

  // Animation state
  const currentModelIdxRef = useRef<number>(0)
  const isAnimatingRef = useRef<boolean>(false)

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

  // Initialize geometry attributes
  const initGeometry = useCallback(() => {
    if (!geometryRef.current) return

    const geometry = geometryRef.current

    // Base geometry is a rounded box
    const baseGeometry = new RoundedBoxGeometry(
      params.boxSize,
      params.boxSize,
      params.boxSize,
      2,
      params.boxRoundness,
    )

    geometry.index = baseGeometry.index
    geometry.attributes.position = baseGeometry.attributes.position
    geometry.attributes.normal = baseGeometry.attributes.normal
    geometry.attributes.uv = baseGeometry.attributes.uv

    // Instanced attributes
    const aPositionStart = new Float32Array(FIXED_INSTANCE_COUNT * 3)
    const aPositionEnd = new Float32Array(FIXED_INSTANCE_COUNT * 3)
    const aColorStart = new Float32Array(FIXED_INSTANCE_COUNT * 3)
    const aColorEnd = new Float32Array(FIXED_INSTANCE_COUNT * 3)
    const aScaleStart = new Float32Array(FIXED_INSTANCE_COUNT)
    const aScaleEnd = new Float32Array(FIXED_INSTANCE_COUNT)
    const aRandom = new Float32Array(FIXED_INSTANCE_COUNT)

    for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
      aRandom[i] = Math.random()
      // Initialize hidden
      aScaleStart[i] = 0
      aScaleEnd[i] = 0

      const idx3 = i * 3
      aPositionStart[idx3] = HIDDEN_POSITION.x
      aPositionStart[idx3 + 1] = HIDDEN_POSITION.y
      aPositionStart[idx3 + 2] = HIDDEN_POSITION.z

      aPositionEnd[idx3] = HIDDEN_POSITION.x
      aPositionEnd[idx3 + 1] = HIDDEN_POSITION.y
      aPositionEnd[idx3 + 2] = HIDDEN_POSITION.z
    }

    geometry.setAttribute('aPositionStart', new THREE.InstancedBufferAttribute(aPositionStart, 3))
    geometry.setAttribute('aPositionEnd', new THREE.InstancedBufferAttribute(aPositionEnd, 3))
    geometry.setAttribute('aColorStart', new THREE.InstancedBufferAttribute(aColorStart, 3))
    geometry.setAttribute('aColorEnd', new THREE.InstancedBufferAttribute(aColorEnd, 3))
    geometry.setAttribute('aScaleStart', new THREE.InstancedBufferAttribute(aScaleStart, 1))
    geometry.setAttribute('aScaleEnd', new THREE.InstancedBufferAttribute(aScaleEnd, 1))
    geometry.setAttribute('aRandom', new THREE.InstancedBufferAttribute(aRandom, 1))
  }, [])

  // Switch to model
  const switchToModel = useCallback((newModelIdx: number) => {
    if (!geometryRef.current || !materialRef.current) return

    const targetData = voxelDataPerModelRef.current[newModelIdx]
    if (!targetData) return

    isAnimatingRef.current = true

    const geometry = geometryRef.current
    const attrPosStart = geometry.attributes.aPositionStart as THREE.InstancedBufferAttribute
    const attrPosEnd = geometry.attributes.aPositionEnd as THREE.InstancedBufferAttribute
    const attrColorStart = geometry.attributes.aColorStart as THREE.InstancedBufferAttribute
    const attrColorEnd = geometry.attributes.aColorEnd as THREE.InstancedBufferAttribute
    const attrScaleStart = geometry.attributes.aScaleStart as THREE.InstancedBufferAttribute
    const attrScaleEnd = geometry.attributes.aScaleEnd as THREE.InstancedBufferAttribute

    // 1. Copy End to Start (current state becomes start state)
    // We can't just copy arrays because the shader might be in the middle of transition if we interrupted it,
    // but for simplicity and performance we assume transition finished or we snap to end.
    // Better: Read the current state from the "End" buffers which represent the visual state at uProgress=1.

    attrPosStart.array.set(attrPosEnd.array)
    attrColorStart.array.set(attrColorEnd.array)
    attrScaleStart.array.set(attrScaleEnd.array)

    // 2. Set new End state
    const posEndArray = attrPosEnd.array as Float32Array
    const colorEndArray = attrColorEnd.array as Float32Array
    const scaleEndArray = attrScaleEnd.array as Float32Array

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

        scaleEndArray[i] = 1.0
      } else {
        // Hide unused voxels
        posEndArray[idx3] = HIDDEN_POSITION.x
        posEndArray[idx3 + 1] = HIDDEN_POSITION.y
        posEndArray[idx3 + 2] = HIDDEN_POSITION.z

        scaleEndArray[i] = 0.0
      }
    }

    // Mark attributes as needing update
    attrPosStart.needsUpdate = true
    attrPosEnd.needsUpdate = true
    attrColorStart.needsUpdate = true
    attrColorEnd.needsUpdate = true
    attrScaleStart.needsUpdate = true
    attrScaleEnd.needsUpdate = true

    // 3. Animate uProgress
    const material = materialRef.current
    material.uniforms.uProgress.value = 0

    gsap.killTweensOf(material.uniforms.uProgress)
    gsap.to(material.uniforms.uProgress, {
      value: 1,
      duration: 1.5, // Total duration including delays
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
  }, [])

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

  // Initialize and start
  useEffect(() => {
    if (loadedModelsCount !== models.length) return

    // Initialize geometry once
    initGeometry()

    // Initial model show
    switchToModel(0)

    // Start rotation interval
    const interval = setInterval(() => {
      const nextIdx = (currentModelIdxRef.current + 1) % models.length
      switchToModel(nextIdx)
    }, params.rotationInterval)

    return () => clearInterval(interval)
  }, [loadedModelsCount, models.length, initGeometry, switchToModel])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, FIXED_INSTANCE_COUNT]}>
        <instancedBufferGeometry ref={geometryRef} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uProgress: { value: 0 },
            uTime: { value: 0 },
          }}
        />
      </instancedMesh>

      {/* Shadow plane */}
      <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[35, 35]} />
        <shadowMaterial opacity={0.1} />
      </mesh>
    </group>
  )
}
