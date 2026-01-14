'use client'

import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import * as THREE from 'three'

interface GetGeometryProps {
  FIXED_INSTANCE_COUNT: number
  HIDDEN_POSITION: THREE.Vector3
}

const HIDDEN_POSITION = new THREE.Vector3(0, -1000, 0)

const params = {
  boxSize: 0.18,
  boxRoundness: 0.03,
}

export const getGeometry = ({ FIXED_INSTANCE_COUNT }: GetGeometryProps) => {
  const geo = new THREE.InstancedBufferGeometry()

  // Базова геометрія
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

  // Позиція вокселля
  const aPositionStart = new Float32Array(FIXED_INSTANCE_COUNT * 3)
  const aPositionEnd = new Float32Array(FIXED_INSTANCE_COUNT * 3)
  // Масштаб вокселя
  const aMisc = new Float32Array(FIXED_INSTANCE_COUNT * 3)
  const aJitter = new Float32Array(FIXED_INSTANCE_COUNT * 3)

  for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
    const idx3 = i * 3

    // Приховування вокселя при старті анміції
    aMisc[idx3] = 0
    aMisc[idx3 + 1] = 0
    aMisc[idx3 + 2] = Math.random()

    aPositionStart[idx3] = HIDDEN_POSITION.x
    aPositionStart[idx3 + 1] = HIDDEN_POSITION.y
    aPositionStart[idx3 + 2] = HIDDEN_POSITION.z

    aPositionEnd[idx3] = HIDDEN_POSITION.x
    aPositionEnd[idx3 + 1] = HIDDEN_POSITION.y
    aPositionEnd[idx3 + 2] = HIDDEN_POSITION.z

    aJitter[idx3] = 0
    aJitter[idx3 + 1] = 0
    aJitter[idx3 + 2] = 0
  }

  geo.setAttribute('aPositionStart', new THREE.InstancedBufferAttribute(aPositionStart, 3))
  geo.setAttribute('aPositionEnd', new THREE.InstancedBufferAttribute(aPositionEnd, 3))
  geo.setAttribute('aMisc', new THREE.InstancedBufferAttribute(aMisc, 3))
  geo.setAttribute('aJitter', new THREE.InstancedBufferAttribute(aJitter, 3))

  geo.instanceCount = FIXED_INSTANCE_COUNT

  return geo
}
