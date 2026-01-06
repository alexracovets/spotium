'use client'

import { DefaultGLProps } from '@react-three/fiber/dist/declarations/src/core/renderer'
import { useRef, memo, useCallback } from 'react'
import { OrbitControls } from '@react-three/drei'
import { WebGPURenderer } from 'three/webgpu'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

import { Wrapper } from '@atoms'
import { Voxels } from './Voxels'

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
  const initRenderer = useCallback(async (props: DefaultGLProps) => {
    const renderer = new WebGPURenderer({ canvas: props.canvas as HTMLCanvasElement })
    await renderer.init()
    return renderer
  }, [])

  return (
    <Wrapper variant="canvas_experience">
      <Canvas
        gl={initRenderer}
        camera={{ position: [0, 0.5, 2].map((v) => v * 8) as [number, number, number], fov: 45 }}
        shadows
      >
        <ambientLight intensity={1} />
        <LightHolder />
        <Voxels />
      </Canvas>
    </Wrapper>
  )
})

CanvasExperience.displayName = 'CanvasExperience'
