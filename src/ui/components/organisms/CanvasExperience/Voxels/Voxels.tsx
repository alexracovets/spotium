'use client'

import {
  SRGBColorSpace,
  InstancedMesh,
  TextureLoader,
  Vector3,
  Group,
  Box3,
  InstancedBufferAttribute,
} from 'three'
import { useEffect, useRef, useCallback, useMemo, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

import { loadTextureMaterial } from './loadTextureMaterial'
import { computeModelTransform } from './computeModelTransform'
import { animateModel as animateModelUtil } from './animateModel'
import { getGeometry } from './getGeometry'
import { LoadModels } from './LoadModels'
import { Carousel } from '../Carousel'

import { useModel } from '@store'

// Кількість воекселів
const FIXED_INSTANCE_COUNT = 20000

const SCATTER_RADIUS = 6

const TEXTURE_PATH = '/texture/voxel/white.png'

type VoxelPreparedItem = {
  position: Vector3
}

interface TransformObject {
  groupPosition: Vector3
  scale: number
  worldCenter: Vector3
}

export const Voxels = () => {
  const { activeModel, modelsWrapperWidth, modelsWrapperHeight, modelsWrapperX, modelsWrapperY } =
    useModel()
  const { camera, size } = useThree()
  const [modelsData, setModelsData] = useState<(VoxelPreparedItem[] | null)[] | null>(null)
  const [modelTransform, setModelTransform] = useState<TransformObject | null>(null)
  const meshRef = useRef<InstancedMesh>(null)
  const groupRef = useRef<Group>(null)

  // Анімації
  const currentModelIdxRef = useRef<number>(0)
  const isAnimatingRef = useRef<boolean>(false)
  const animProgressRef = useRef<number>(0)
  const lastActiveCountRef = useRef<number>(0)
  const usesWorldSpacePositionsRef = useRef(false)
  const lastTransformRef = useRef<TransformObject | null>(null)
  const lastModelChangeRef = useRef<{
    activeModel: number | null
    modelsData: (VoxelPreparedItem[] | null)[] | null
  }>({ activeModel: null, modelsData: null })

  const geometry = useMemo(() => {
    return getGeometry({ FIXED_INSTANCE_COUNT })
  }, [])

  const voxelTexture = useMemo(() => {
    const loader = new TextureLoader()
    const tex = loader.load(TEXTURE_PATH)
    tex.colorSpace = SRGBColorSpace
    return tex
  }, [])

  const material = useMemo(() => {
    return loadTextureMaterial({ voxelTexture })
  }, [voxelTexture])

  const animateModel = useCallback(
    (
      newModelIdx: number,
      mode: 'shape' | 'scatter',
      providedData?: VoxelPreparedItem[],
      transform?: TransformObject,
      fadeOut?: boolean,
      resetProgress?: boolean,
      prevActiveCount?: number,
    ) => {
      animateModelUtil({
        newModelIdx,
        mode,
        providedData,
        fadeOut,
        resetProgress,
        prevActiveCount,
        modelsData,
        transform,
        geometry,
        isAnimatingRef,
        animProgressRef,
        currentModelIdxRef,
        FIXED_INSTANCE_COUNT,
        SCATTER_RADIUS,
      })
    },
    [geometry, modelsData],
  )

  const switchToModel = useCallback(
    (
      newModelIdx: number,
      providedData?: VoxelPreparedItem[],
      transform?: TransformObject,
      resetProgress?: boolean,
      prevActiveCount?: number,
    ) =>
      animateModel(
        newModelIdx,
        'shape',
        providedData,
        transform,
        false,
        resetProgress,
        prevActiveCount,
      ),
    [animateModel],
  )

  const scatterModel = useCallback(
    (
      newModelIdx: number,
      providedData?: VoxelPreparedItem[],
      transform?: TransformObject,
      fadeOut?: boolean,
      resetProgress?: boolean,
    ) => animateModel(newModelIdx, 'scatter', providedData, transform, fadeOut, resetProgress),
    [animateModel],
  )

  const currentModelBoundingBox = useMemo(() => {
    if (!modelsData || activeModel < 0) return null

    const modelData = modelsData[activeModel]
    if (!modelData || modelData.length === 0) return null

    const box = new Box3()
    modelData.forEach((voxel) => {
      box.expandByPoint(voxel.position)
    })
    return box
  }, [modelsData, activeModel])

  const carouselPosition = useMemo(() => {
    if (!modelTransform) return null
    return modelTransform.worldCenter
  }, [modelTransform])

  const bakePositionsToWorldSpace = useCallback(
    (transform: TransformObject) => {
      const attrPosStart = geometry.attributes.aPositionStart as InstancedBufferAttribute
      const attrPosEnd = geometry.attributes.aPositionEnd as InstancedBufferAttribute
      const startArray = attrPosStart.array as Float32Array
      const endArray = attrPosEnd.array as Float32Array

      for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
        const idx3 = i * 3
        startArray[idx3] = startArray[idx3] * transform.scale + transform.groupPosition.x
        startArray[idx3 + 1] = startArray[idx3 + 1] * transform.scale + transform.groupPosition.y
        startArray[idx3 + 2] = startArray[idx3 + 2] * transform.scale + transform.groupPosition.z

        endArray[idx3] = endArray[idx3] * transform.scale + transform.groupPosition.x
        endArray[idx3 + 1] = endArray[idx3 + 1] * transform.scale + transform.groupPosition.y
        endArray[idx3 + 2] = endArray[idx3 + 2] * transform.scale + transform.groupPosition.z
      }

      attrPosStart.needsUpdate = true
      attrPosEnd.needsUpdate = true
    },
    [geometry],
  )

  useFrame((_, delta) => {
    if (!isAnimatingRef.current) return

    const attrPosStart = geometry.attributes.aPositionStart as InstancedBufferAttribute
    const attrPosEnd = geometry.attributes.aPositionEnd as InstancedBufferAttribute
    const attrMisc = geometry.attributes.aMisc as InstancedBufferAttribute
    const startArray = attrPosStart.array as Float32Array
    const endArray = attrPosEnd.array as Float32Array
    const miscArray = attrMisc.array as Float32Array

    const transitionDuration = 10.0
    animProgressRef.current = Math.min(1, animProgressRef.current + delta / transitionDuration)
    const t = animProgressRef.current
    const lerpSpeed = t < 0.7 ? 5 : 16
    const lerpFactor = 1 - Math.exp(-lerpSpeed * delta)
    let maxDelta = 0

    for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
      const idx3 = i * 3
      const dx = endArray[idx3] - startArray[idx3]
      const dy = endArray[idx3 + 1] - startArray[idx3 + 1]
      const dz = endArray[idx3 + 2] - startArray[idx3 + 2]

      startArray[idx3] += dx * lerpFactor
      startArray[idx3 + 1] += dy * lerpFactor
      startArray[idx3 + 2] += dz * lerpFactor

      const scaleDelta = miscArray[idx3 + 1] - miscArray[idx3]
      miscArray[idx3] += scaleDelta * lerpFactor

      const localMax = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz), Math.abs(scaleDelta))
      if (localMax > maxDelta) maxDelta = localMax
    }

    attrPosStart.needsUpdate = true
    attrMisc.needsUpdate = true

    if (maxDelta < 1e-3 && animProgressRef.current >= 1) {
      isAnimatingRef.current = false
    }
  })

  useEffect(() => {
    if (!modelsData || modelsData.length === 0) return

    const shouldRunModelChange =
      lastModelChangeRef.current.activeModel !== activeModel ||
      lastModelChangeRef.current.modelsData !== modelsData

    if (activeModel < 0) {
      if (shouldRunModelChange) {
        const fallbackIdx = currentModelIdxRef.current
        const fallbackData =
          modelsData[fallbackIdx] ?? modelsData.find((model) => model && model.length > 0)
        const transformForPositions = usesWorldSpacePositionsRef.current
          ? (lastTransformRef.current ?? undefined)
          : undefined
        if (!fallbackData) return
        scatterModel(fallbackIdx, fallbackData, transformForPositions, true)
        lastModelChangeRef.current = { activeModel, modelsData }
        setModelTransform(null)
      }
      return
    }

    if (
      !currentModelBoundingBox ||
      !modelsWrapperHeight ||
      !modelsWrapperWidth ||
      modelsWrapperX === null ||
      modelsWrapperY === null
    ) {
      setModelTransform(null)
      return
    }

    const nextTransform = computeModelTransform({
      boundingBox: currentModelBoundingBox,
      camera,
      size,
      modelsWrapperHeight,
      modelsWrapperWidth,
      modelsWrapperX,
      modelsWrapperY,
    })

    if (!groupRef.current || !nextTransform) {
      setModelTransform(null)
      return
    }

    if (!usesWorldSpacePositionsRef.current && lastTransformRef.current) {
      bakePositionsToWorldSpace(lastTransformRef.current)
      usesWorldSpacePositionsRef.current = true
    }

    if (usesWorldSpacePositionsRef.current) {
      groupRef.current.scale.set(1, 1, 1)
      groupRef.current.position.set(0, 0, 0)
    }

    const transformForPositions = usesWorldSpacePositionsRef.current ? nextTransform : undefined

    const transformChanged =
      !lastTransformRef.current ||
      lastTransformRef.current.scale !== nextTransform.scale ||
      lastTransformRef.current.groupPosition.x !== nextTransform.groupPosition.x ||
      lastTransformRef.current.groupPosition.y !== nextTransform.groupPosition.y ||
      lastTransformRef.current.groupPosition.z !== nextTransform.groupPosition.z

    if (shouldRunModelChange) {
      const data = modelsData[activeModel]
      if (data && data.length > 0) {
        switchToModel(
          activeModel,
          data,
          transformForPositions,
          undefined,
          lastActiveCountRef.current,
        )
        lastActiveCountRef.current = data.length
      } else {
        const fallbackIdx = currentModelIdxRef.current
        const fallbackData =
          modelsData[fallbackIdx] ?? modelsData.find((model) => model && model.length > 0)
        if (!fallbackData) return
        scatterModel(fallbackIdx, fallbackData, transformForPositions, true)
      }

      lastModelChangeRef.current = { activeModel, modelsData }
    } else if (transformChanged) {
      const data = modelsData[activeModel]
      const fallbackData = data ?? modelsData.find((model) => model && model.length > 0)
      if (!fallbackData) return
      switchToModel(
        activeModel,
        fallbackData,
        transformForPositions,
        false,
        lastActiveCountRef.current,
      )
      lastActiveCountRef.current = fallbackData.length
    }

    if (transformChanged) {
      setModelTransform(nextTransform)
      lastTransformRef.current = nextTransform
    }
  }, [
    activeModel,
    modelsData,
    modelsWrapperHeight,
    modelsWrapperWidth,
    modelsWrapperX,
    modelsWrapperY,
    currentModelBoundingBox,
    scatterModel,
    switchToModel,
    bakePositionsToWorldSpace,
    camera,
    size,
  ])

  return (
    <>
      <LoadModels setModelsData={setModelsData} modelsData={modelsData} />
      <group ref={groupRef}>
        <mesh ref={meshRef} geometry={geometry}>
          <primitive object={material} attach="material" />
        </mesh>
      </group>
      <Carousel
        boundingBox={currentModelBoundingBox}
        modelScale={modelTransform?.scale}
        position={carouselPosition}
        activeModel={activeModel}
      />
    </>
  )
}
