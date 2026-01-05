'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Wrapper } from '@atoms'
import { Voxels } from './Voxels'
import { useRef, memo, useCallback } from 'react'
import * as THREE from 'three'
import { WebGPURenderer } from 'three/webgpu'

const LightHolder = () => {
  const groupRef = useRef<THREE.Group>(null)

  return (
    <group ref={groupRef}>
      <spotLight
        position={[0, 15, 3]}
        intensity={0.4}
        castShadow
        shadow-camera-near={10}
        shadow-camera-far={30}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <spotLight position={[0, -4, 5]} intensity={0.4} />
    </group>
  )
}

export const CanvasExperience = memo(() => {
  const initRenderer = useCallback(async (props: any) => {
    const renderer = new WebGPURenderer(props)
    await renderer.init()
    return renderer
  }, [])

  return (
    <Wrapper variant="canvas_experience" className="z-1">
      <Canvas
        gl={initRenderer}
        camera={{ position: [0, 0.5, 2].map((v) => v * 8) as [number, number, number], fov: 45 }}
        shadows
      >
        <ambientLight intensity={1} />
        <LightHolder />
        <Voxels />
        <OrbitControls
          enablePan={false}
          autoRotate
          minDistance={20}
          maxDistance={30}
          minPolarAngle={0.35 * Math.PI}
          maxPolarAngle={0.65 * Math.PI}
          enableDamping
        />
      </Canvas>
    </Wrapper>
  )
})
