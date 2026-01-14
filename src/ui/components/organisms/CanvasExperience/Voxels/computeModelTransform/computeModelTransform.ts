'use client'

import { Box3, Vector3, PerspectiveCamera } from 'three'
import { Camera } from 'three'

interface ComputeModelTransformProps {
  boundingBox: Box3
  camera: Camera
  size: { width: number; height: number }
  modelsWrapperHeight: number
  modelsWrapperWidth: number
  modelsWrapperX: number
  modelsWrapperY: number
}

export const computeModelTransform = ({
  boundingBox,
  camera,
  size,
  modelsWrapperHeight,
  modelsWrapperWidth,
  modelsWrapperX,
  modelsWrapperY,
}: ComputeModelTransformProps) => {
  if (
    !boundingBox ||
    !modelsWrapperHeight ||
    !modelsWrapperWidth ||
    modelsWrapperX === null ||
    modelsWrapperY === null ||
    !camera ||
    !size
  ) {
    return null
  }

  const modelSize = boundingBox.getSize(new Vector3())
  const modelCenter = boundingBox.getCenter(new Vector3())

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

  const canvasCenterX = size.width / 2
  const canvasCenterY = size.height / 2
  const wrapperCenterX = modelsWrapperX + modelsWrapperWidth / 2
  const wrapperCenterY = modelsWrapperY + modelsWrapperHeight / 2

  const normalizedX = ((wrapperCenterX - canvasCenterX) / size.width) * 2
  const normalizedY = ((canvasCenterY - wrapperCenterY) / size.height) * 2

  const positionX = normalizedX * (canvasVisibleWidth / 2)
  const positionY = normalizedY * (canvasVisibleHeight / 2)

  const scaledCenter = modelCenter.clone().multiplyScalar(finalScale)
  const groupPosition = new Vector3(
    positionX - scaledCenter.x,
    positionY - scaledCenter.y,
    -scaledCenter.z,
  )

  return {
    groupPosition,
    scale: finalScale,
    worldCenter: new Vector3(positionX, positionY, 0),
  }
}
