'use client'

import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { useEffect, useRef, useCallback, useMemo, useState } from 'react'
import { MeshStandardNodeMaterial } from 'three/webgpu'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import {
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  PerspectiveCamera,
  SRGBColorSpace,
  InstancedMesh,
  TextureLoader,
  Vector3,
  Group,
  Box3,
} from 'three'
import {
  positionLocal,
  smoothstep,
  normalView,
  attribute,
  uniform,
  texture,
  float,
  mix,
} from 'three/tsl'

import { LoadModels } from './LoadModels'
import { Carousel } from '../Carousel'

import { useModel } from '@store'

// Кількість воекселів
const FIXED_INSTANCE_COUNT = 20000
const HIDDEN_POSITION = new Vector3(0, -1000, 0)

// Параметри воекселів
const params = {
  boxSize: 0.18,
  boxRoundness: 0.03,
}

const SCATTER_RADIUS = 6

const TEXTURE_PATH = '/texture/voxel/white.png'

type VoxelPreparedItem = {
  position: Vector3
}

export const Voxels = () => {
  const { activeModel, modelsWrapperWidth, modelsWrapperHeight, modelsWrapperX, modelsWrapperY } =
    useModel()
  const [modelsData, setModelsData] = useState<(VoxelPreparedItem[] | null)[] | null>(null)

  const { camera, size } = useThree()

  const meshRef = useRef<InstancedMesh>(null)
  const groupRef = useRef<Group>(null)
  const [modelTransform, setModelTransform] = useState<{
    groupPosition: Vector3
    scale: number
    worldCenter: Vector3
  } | null>(null)

  // Анімації
  const currentModelIdxRef = useRef<number>(0)
  const isAnimatingRef = useRef<boolean>(false)

  // Геометрія
  const geometry = useMemo(() => {
    const geo = new InstancedBufferGeometry()

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
    }

    geo.setAttribute('aPositionStart', new InstancedBufferAttribute(aPositionStart, 3))
    geo.setAttribute('aPositionEnd', new InstancedBufferAttribute(aPositionEnd, 3))
    geo.setAttribute('aMisc', new InstancedBufferAttribute(aMisc, 3))

    geo.instanceCount = FIXED_INSTANCE_COUNT

    return geo
  }, [])

  // TSL Setup
  const uProgress = useMemo(() => uniform(0), [])

  // Завантаження текстури
  const voxelTexture = useMemo(() => {
    const loader = new TextureLoader()
    const tex = loader.load(TEXTURE_PATH)
    tex.colorSpace = SRGBColorSpace
    return tex
  }, [])

  const material = useMemo(() => {
    const m = new MeshStandardNodeMaterial()
    const aPositionStart = attribute('aPositionStart', 'vec3')
    const aPositionEnd = attribute('aPositionEnd', 'vec3')
    const aMisc = attribute('aMisc', 'vec3')
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
    const scale = mix(aScaleStart, aScaleEnd, t)
    m.positionNode = pos.add(positionLocal.mul(scale))
    const matcapUV = normalView.xy.mul(0.5).add(0.5)
    const matcapColor = texture(voxelTexture, matcapUV)
    const finalColor = matcapColor
    m.colorNode = finalColor
    return m
  }, [uProgress, voxelTexture])

  const animateModel = useCallback(
    (newModelIdx: number, mode: 'shape' | 'scatter', providedData?: VoxelPreparedItem[]) => {
      const targetData = providedData ?? modelsData?.[newModelIdx]
      if (!targetData) return

      isAnimatingRef.current = true

      const attrPosStart = geometry.attributes.aPositionStart as InstancedBufferAttribute
      const attrPosEnd = geometry.attributes.aPositionEnd as InstancedBufferAttribute
      const attrMisc = geometry.attributes.aMisc as InstancedBufferAttribute

      // Копіюємо поточний стан як старт
      attrPosStart.array.set(attrPosEnd.array)

      const miscArray = attrMisc.array as Float32Array
      const posEndArray = attrPosEnd.array as Float32Array

      // scaleStart = scaleEnd (оновимо scaleEnd нижче)
      for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
        const idx3 = i * 3
        miscArray[idx3] = miscArray[idx3 + 1]
      }

      for (let i = 0; i < FIXED_INSTANCE_COUNT; i++) {
        const idx3 = i * 3

        if (i < targetData.length) {
          const voxel = targetData[i]
          if (mode === 'scatter') {
            const jitterX = (Math.random() - 0.5) * 2 * SCATTER_RADIUS
            const jitterY = (Math.random() - 0.5) * 2 * SCATTER_RADIUS
            const jitterZ = (Math.random() - 0.5) * 2 * SCATTER_RADIUS

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

  const carouselRadius = useMemo(() => {
    if (!currentModelBoundingBox) return 2
    const size = currentModelBoundingBox.getSize(new Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    // Трохи більший за модель, щоб слайди були довкола
    return (maxDim / 2) * 1.3
  }, [currentModelBoundingBox])

  const scaledCarouselRadius = useMemo(() => {
    if (!modelTransform) return carouselRadius
    return carouselRadius * modelTransform.scale
  }, [carouselRadius, modelTransform])

  const carouselPosition = useMemo(() => {
    if (!modelTransform) return null
    return modelTransform.worldCenter
  }, [modelTransform])

  // Масштабування та позиціонування моделі на основі розмірів та позиції models_wrapper
  useEffect(() => {
    if (
      !groupRef.current ||
      !currentModelBoundingBox ||
      !modelsWrapperHeight ||
      !modelsWrapperWidth ||
      modelsWrapperX === null ||
      modelsWrapperY === null ||
      !camera ||
      !size
    ) {
      setModelTransform(null)
      return
    }

    const box = currentModelBoundingBox
    const modelSize = box.getSize(new Vector3())
    const modelCenter = box.getCenter(new Vector3())

    const cameraDistance = camera.position.length()
    const canvasAspect = size.width / size.height

    const fovRad = camera instanceof PerspectiveCamera ? (camera.fov * Math.PI) / 180 : null
    const canvasVisibleHeight =
      fovRad !== null ? 2 * cameraDistance * Math.tan(fovRad / 2) : size.height
    const canvasVisibleWidth = fovRad !== null ? canvasVisibleHeight * canvasAspect : size.width

    const wrapperWidthRatio = modelsWrapperWidth / size.width
    const wrapperHeightRatio = modelsWrapperHeight / size.height
    const wrapperVisibleWidth = canvasVisibleWidth * wrapperWidthRatio
    const wrapperVisibleHeight = canvasVisibleHeight * wrapperHeightRatio

    const scaleFactor = 0.7
    const targetHeight = wrapperVisibleHeight * scaleFactor
    const targetWidth = wrapperVisibleWidth * scaleFactor
    const finalScale = Math.min(targetHeight / modelSize.y, targetWidth / modelSize.x)

    groupRef.current.scale.set(finalScale, finalScale, finalScale)

    const canvasCenterX = size.width / 2
    const canvasCenterY = size.height / 2
    const wrapperCenterX = modelsWrapperX + modelsWrapperWidth / 2
    const wrapperCenterY = modelsWrapperY + modelsWrapperHeight / 2

    const normalizedX = ((wrapperCenterX - canvasCenterX) / size.width) * 2
    const normalizedY = ((canvasCenterY - wrapperCenterY) / size.height) * 2

    const positionX = normalizedX * (canvasVisibleWidth / 2)
    const positionY = normalizedY * (canvasVisibleHeight / 2)

    const scaledCenter = modelCenter.clone().multiplyScalar(finalScale)
    groupRef.current.position.set(
      positionX - scaledCenter.x,
      positionY - scaledCenter.y,
      -scaledCenter.z,
    )

    setModelTransform({
      groupPosition: new Vector3(
        positionX - scaledCenter.x,
        positionY - scaledCenter.y,
        -scaledCenter.z,
      ),
      scale: finalScale,
      worldCenter: new Vector3(positionX, positionY, 0),
    })
  }, [
    currentModelBoundingBox,
    modelsWrapperHeight,
    modelsWrapperWidth,
    modelsWrapperX,
    modelsWrapperY,
    camera,
    size,
  ])

  useEffect(() => {
    if (!modelsData || modelsData.length === 0) return

    const hasWrapper =
      !!modelsWrapperHeight &&
      !!modelsWrapperWidth &&
      modelsWrapperX !== null &&
      modelsWrapperY !== null

    if (activeModel < 0) {
      const fallbackIdx = currentModelIdxRef.current
      const fallbackData =
        modelsData[fallbackIdx] ?? modelsData.find((model) => model && model.length > 0)
      if (!fallbackData) return
      scatterModel(fallbackIdx, fallbackData)
      return
    }

    const data = modelsData[activeModel]
    if (!data) return

    if (hasWrapper) {
      switchToModel(activeModel, data)
    } else {
      scatterModel(activeModel, data)
    }
  }, [
    activeModel,
    modelsData,
    modelsWrapperHeight,
    modelsWrapperWidth,
    modelsWrapperX,
    modelsWrapperY,
    scatterModel,
    switchToModel,
  ])

  return (
    <>
      <LoadModels setModelsData={setModelsData} modelsData={modelsData} />
      <group ref={groupRef}>
        <mesh ref={meshRef} geometry={geometry}>
          <primitive object={material} attach="material" />
        </mesh>
      </group>
      {carouselPosition && activeModel === 2 && (
        <group position={carouselPosition.toArray()}>
          <Carousel radius={scaledCarouselRadius} />
        </group>
      )}
    </>
  )
}
