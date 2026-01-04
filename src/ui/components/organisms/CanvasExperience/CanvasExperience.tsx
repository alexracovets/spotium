'use client'

import { Canvas } from '@react-three/fiber'

import { Voxels } from './Voxels'
import { OrbitControls } from '@react-three/drei'
import { Wrapper } from '@atoms'

export const CanvasExperience = () => {
  return (
    <Wrapper variant="canvas_experience" className="z-1">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={1} />
        <Voxels />
        <OrbitControls />
      </Canvas>
    </Wrapper>
  )
}
