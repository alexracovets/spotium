'use client'

import { MeshStandardNodeMaterial } from 'three/webgpu'
import { Texture } from 'three'

import { positionLocal, normalView, attribute, texture } from 'three/tsl'

interface LoadTextureMaterialProps {
  voxelTexture: Texture
}

export const loadTextureMaterial = ({ voxelTexture }: LoadTextureMaterialProps) => {
  const m = new MeshStandardNodeMaterial()
  const aPositionStart = attribute('aPositionStart', 'vec3')
  const aMisc = attribute('aMisc', 'vec3')
  const aScaleStart = aMisc.x
  m.positionNode = aPositionStart.add(positionLocal.mul(aScaleStart))
  const matcapUV = normalView.xy.mul(0.5).add(0.5)
  const matcapColor = texture(voxelTexture, matcapUV)
  const finalColor = matcapColor
  m.colorNode = finalColor
  return m
}
