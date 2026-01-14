'use client'

import { InstancedBufferAttribute, Vector3 } from 'three'
import { InstancedBufferGeometry } from 'three'
import { RefObject } from 'react'
import gsap from 'gsap'
import type { uniform } from 'three/tsl'

interface AnimateModelProps {
  newModelIdx: number
  mode: 'shape' | 'scatter'
  providedData?: { position: Vector3 }[]
  modelsData: ({ position: Vector3 }[] | null)[] | null
  geometry: InstancedBufferGeometry
  isAnimatingRef: RefObject<boolean>
  currentModelIdxRef: RefObject<number>
  FIXED_INSTANCE_COUNT: number
  SCATTER_RADIUS: number
  HIDDEN_POSITION: Vector3
  uProgress: ReturnType<typeof uniform>
}

export const animateModel = ({
  newModelIdx,
  mode,
  providedData,
  modelsData,
  geometry,
  isAnimatingRef,
  currentModelIdxRef,
  FIXED_INSTANCE_COUNT,
  SCATTER_RADIUS,
  HIDDEN_POSITION,
  uProgress,
}: AnimateModelProps) => {
  const targetData = providedData ?? modelsData?.[newModelIdx]
  if (!targetData) return

  isAnimatingRef.current = true

  const attrPosStart = geometry.attributes.aPositionStart as InstancedBufferAttribute
  const attrPosEnd = geometry.attributes.aPositionEnd as InstancedBufferAttribute
  const attrMisc = geometry.attributes.aMisc as InstancedBufferAttribute
  const attrJitter = geometry.attributes.aJitter as InstancedBufferAttribute

  // Копіюємо поточний стан як старт
  attrPosStart.array.set(attrPosEnd.array)

  const miscArray = attrMisc.array as Float32Array
  const posEndArray = attrPosEnd.array as Float32Array
  const jitterArray = attrJitter.array as Float32Array

  // scaleStart = scaleEnd (оновимо scaleEnd нижче)
  for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
    const idx3 = i * 3
    miscArray[idx3] = miscArray[idx3 + 1]
  }

  for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
    const idx3 = i * 3

    const jitterX = (Math.random() - 0.5) * 2 * SCATTER_RADIUS
    const jitterY = (Math.random() - 0.5) * 2 * SCATTER_RADIUS
    const jitterZ = (Math.random() - 0.5) * 2 * SCATTER_RADIUS

    jitterArray[idx3] = jitterX
    jitterArray[idx3 + 1] = jitterY
    jitterArray[idx3 + 2] = jitterZ

    if (i < targetData.length) {
      const voxel = targetData[i]
      if (mode === 'scatter') {
        posEndArray[idx3] = voxel.position.x + jitterX
        posEndArray[idx3 + 1] = voxel.position.y + jitterY
        posEndArray[idx3 + 2] = voxel.position.z + jitterZ

        miscArray[idx3 + 1] = 0 // зникає
      } else {
        posEndArray[idx3] = voxel.position.x
        posEndArray[idx3 + 1] = voxel.position.y
        posEndArray[idx3 + 2] = voxel.position.z

        miscArray[idx3 + 1] = 1.0 // показати
      }
    } else {
      posEndArray[idx3] = HIDDEN_POSITION.x
      posEndArray[idx3 + 1] = HIDDEN_POSITION.y
      posEndArray[idx3 + 2] = HIDDEN_POSITION.z

      miscArray[idx3 + 1] = 0.0
    }
  }

  attrPosStart.needsUpdate = true
  attrPosEnd.needsUpdate = true
  attrMisc.needsUpdate = true
  attrJitter.needsUpdate = true

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

  currentModelIdxRef.current = newModelIdx
}
