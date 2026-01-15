'use client'

import { InstancedBufferAttribute, Vector3 } from 'three'
import { InstancedBufferGeometry } from 'three'
import { RefObject } from 'react'

interface AnimateModelProps {
  newModelIdx: number
  mode: 'shape' | 'scatter'
  providedData?: { position: Vector3 }[]
  fadeOut?: boolean
  resetProgress?: boolean
  prevActiveCount?: number
  rotationY?: number
  rotationCenter?: Vector3
  modelsData: ({ position: Vector3 }[] | null)[] | null
  transform?: {
    scale: number
    groupPosition: Vector3
  }
  geometry: InstancedBufferGeometry
  isAnimatingRef: RefObject<boolean>
  animProgressRef: RefObject<number>
  currentModelIdxRef: RefObject<number>
  FIXED_INSTANCE_COUNT: number
  SCATTER_RADIUS: number
}

export const animateModel = ({
  newModelIdx,
  mode,
  providedData,
  fadeOut = false,
  resetProgress = true,
  prevActiveCount,
  rotationY,
  rotationCenter,
  modelsData,
  transform,
  geometry,
  isAnimatingRef,
  animProgressRef,
  currentModelIdxRef,
  FIXED_INSTANCE_COUNT,
  SCATTER_RADIUS,
}: AnimateModelProps) => {
  const targetData = providedData ?? modelsData?.[newModelIdx]
  if (!targetData) return

  isAnimatingRef.current = true
  if (resetProgress) {
    animProgressRef.current = 0
  }

  const attrPosStart = geometry.attributes.aPositionStart as InstancedBufferAttribute
  const attrPosEnd = geometry.attributes.aPositionEnd as InstancedBufferAttribute
  const attrMisc = geometry.attributes.aMisc as InstancedBufferAttribute
  const attrJitter = geometry.attributes.aJitter as InstancedBufferAttribute
  const startArray = attrPosStart.array as Float32Array

  const miscArray = attrMisc.array as Float32Array
  const posEndArray = attrPosEnd.array as Float32Array
  const jitterArray = attrJitter.array as Float32Array
  const hasRotation = typeof rotationY === 'number' && rotationCenter
  const cosY = hasRotation ? Math.cos(rotationY as number) : 1
  const sinY = hasRotation ? Math.sin(rotationY as number) : 0

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
      let baseX = transform
        ? voxel.position.x * transform.scale + transform.groupPosition.x
        : voxel.position.x
      let baseY = transform
        ? voxel.position.y * transform.scale + transform.groupPosition.y
        : voxel.position.y
      let baseZ = transform
        ? voxel.position.z * transform.scale + transform.groupPosition.z
        : voxel.position.z

      if (hasRotation && rotationCenter) {
        const dx = baseX - rotationCenter.x
        const dz = baseZ - rotationCenter.z
        baseX = rotationCenter.x + dx * cosY - dz * sinY
        baseZ = rotationCenter.z + dx * sinY + dz * cosY
      }
      if (mode === 'scatter') {
        posEndArray[idx3] = baseX + jitterX
        posEndArray[idx3 + 1] = baseY + jitterY
        posEndArray[idx3 + 2] = baseZ + jitterZ

        miscArray[idx3 + 1] = fadeOut ? 0 : 0
      } else {
        posEndArray[idx3] = baseX
        posEndArray[idx3 + 1] = baseY
        posEndArray[idx3 + 2] = baseZ

        miscArray[idx3 + 1] = fadeOut ? 0 : 1.0 // показати
      }

      if (
        mode === 'shape' &&
        typeof prevActiveCount === 'number' &&
        prevActiveCount >= 0 &&
        i >= prevActiveCount
      ) {
        // Нові вокселі стартують зі "scatter"-позицій і влітають у форму
        startArray[idx3] = baseX + jitterX
        startArray[idx3 + 1] = baseY + jitterY
        startArray[idx3 + 2] = baseZ + jitterZ
        miscArray[idx3] = 0
      }
    } else {
      posEndArray[idx3] = Math.random() * 20 - 10
      posEndArray[idx3 + 1] = Math.random() * 20 - 10
      posEndArray[idx3 + 2] = Math.random() * 20 - 10

      miscArray[idx3 + 1] = 0.0
    }
  }

  attrPosStart.needsUpdate = true
  attrPosEnd.needsUpdate = true
  attrMisc.needsUpdate = true
  attrJitter.needsUpdate = true

  currentModelIdxRef.current = newModelIdx
}
