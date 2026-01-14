'use client'

import { MathNodeParameter } from 'three/src/nodes/math/MathNode.js'
import { MeshStandardNodeMaterial } from 'three/webgpu'
import { Texture } from 'three'

import { positionLocal, smoothstep, normalView, attribute, texture, float, mix } from 'three/tsl'

interface LoadTextureMaterialProps {
  uProgress: MathNodeParameter
  voxelTexture: Texture
}

export const loadTextureMaterial = ({ uProgress, voxelTexture }: LoadTextureMaterialProps) => {
  const m = new MeshStandardNodeMaterial()
  const aPositionStart = attribute('aPositionStart', 'vec3')
  const aPositionEnd = attribute('aPositionEnd', 'vec3')
  const aMisc = attribute('aMisc', 'vec3')
  const aJitter = attribute('aJitter', 'vec3')
  const aScaleStart = aMisc.x
  const aScaleEnd = aMisc.y
  const aRandom = aMisc.z
  const duration = float(0.6)
  const delay = aRandom.mul(0.4)
  const t = smoothstep(delay, delay.add(duration), uProgress)
  const s = float(1.70158)
  const tMinus1 = t.sub(1.0)
  const easedT = tMinus1
    .mul(tMinus1)
    .mul(tMinus1.mul(s.add(1.0)).add(s))
    .add(1.0)
  const pos = mix(aPositionStart, aPositionEnd, easedT)
  const explosionFactor = t.mul(float(1.0).sub(t)).mul(float(4.0))
  const explodedPos = pos.add(aJitter.mul(explosionFactor))
  const scale = mix(aScaleStart, aScaleEnd, t)
  m.positionNode = explodedPos.add(positionLocal.mul(scale))
  const matcapUV = normalView.xy.mul(0.5).add(0.5)
  const matcapColor = texture(voxelTexture, matcapUV)
  const finalColor = matcapColor
  m.colorNode = finalColor
  return m
}
