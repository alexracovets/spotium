'use client'

import { SRGBColorSpace, InstancedMesh, TextureLoader, Vector3, Group, Box3 } from 'three'
import { useEffect, useRef, useCallback, useMemo, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { uniform } from 'three/tsl'

import { loadTextureMaterial } from './loadTextureMaterial'
import { computeModelTransform } from './computeModelTransform'
import { animateModel as animateModelUtil } from './animateModel'
import { getGeometry } from './getGeometry'
import { LoadModels } from './LoadModels'
import { Carousel } from '../Carousel'

import { useModel } from '@store'

// Кількість воекселів
const FIXED_INSTANCE_COUNT = 20000
const HIDDEN_POSITION = new Vector3(0, -1000, 0)

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
  const uProgress = useMemo(() => uniform(0), [])
  const currentModelIdxRef = useRef<number>(0)
  const isAnimatingRef = useRef<boolean>(false)
  const lastModelChangeRef = useRef<{
    activeModel: number | null
    modelsData: (VoxelPreparedItem[] | null)[] | null
  }>({ activeModel: null, modelsData: null })

  const geometry = useMemo(() => {
    return getGeometry({ FIXED_INSTANCE_COUNT, HIDDEN_POSITION })
  }, [])

  const voxelTexture = useMemo(() => {
    const loader = new TextureLoader()
    const tex = loader.load(TEXTURE_PATH)
    tex.colorSpace = SRGBColorSpace
    return tex
  }, [])

  const material = useMemo(() => {
    return loadTextureMaterial({ uProgress, voxelTexture })
  }, [uProgress, voxelTexture])

  const animateModel = useCallback(
    (newModelIdx: number, mode: 'shape' | 'scatter', providedData?: VoxelPreparedItem[]) => {
      animateModelUtil({
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
      })
    },
    [geometry, modelsData, uProgress],
  )

  const switchToModel = useCallback(
    (newModelIdx: number, providedData?: VoxelPreparedItem[]) =>
      animateModel(newModelIdx, 'shape', providedData),
    [animateModel],
  )

  const scatterModel = useCallback(
    (newModelIdx: number, providedData?: VoxelPreparedItem[]) =>
      animateModel(newModelIdx, 'scatter', providedData),
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

  useEffect(() => {
    if (!modelsData || modelsData.length === 0) return

    const shouldRunModelChange =
      lastModelChangeRef.current.activeModel !== activeModel ||
      lastModelChangeRef.current.modelsData !== modelsData

    if (shouldRunModelChange) {
      const data = activeModel >= 0 ? modelsData[activeModel] : null
      if (data && data.length > 0) {
        switchToModel(activeModel, data)
      } else {
        const fallbackIdx = currentModelIdxRef.current
        const fallbackData =
          modelsData[fallbackIdx] ?? modelsData.find((model) => model && model.length > 0)
        if (!fallbackData) return
        scatterModel(fallbackIdx, fallbackData)
      }

      lastModelChangeRef.current = { activeModel, modelsData }
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

    groupRef.current.scale.set(nextTransform.scale, nextTransform.scale, nextTransform.scale)
    groupRef.current.position.copy(nextTransform.groupPosition)
    setModelTransform(nextTransform)
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
