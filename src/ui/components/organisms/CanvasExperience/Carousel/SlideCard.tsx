'use client'

import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { easing } from 'maath'
import { Media } from '@payload-types'

type MediaData = {
  type: 'image' | 'video'
  texture?: THREE.Texture
  videoElement?: HTMLVideoElement
  videoTexture?: THREE.VideoTexture
  media: Media
}

type SlideCardProps = {
  mediaData: MediaData
  position: [number, number, number]
  rotation: [number, number, number]
  totalSlides: number
  radius: number
}

export const SlideCard = ({
  mediaData,
  position,
  rotation,
  totalSlides,
  radius,
}: SlideCardProps) => {
  const ref = useRef<THREE.Mesh>(null)
  const [hovered, hover] = useState(false)

  // Обчислюємо ширину слайду на основі дуги кола (360 градусів)
  // Кут дуги на один слайд в градусах: 360 / кількість слайдів
  const arcAngleDegrees = 360 / totalSlides
  // Конвертуємо в радіани
  const arcAngleRadians = (arcAngleDegrees * Math.PI) / 180
  // Обчислюємо довжину дуги кола: arcLength = radius * angle (в радіанах)
  const slideWidth = radius * arcAngleRadians

  // Радіус скруглення кутів (відносно розміру слайду)
  // Використовуємо 15% від меншого розміру (ширини або висоти), мінімум 0.3
  const baseCornerRadius = 0.3

  useFrame((state, delta) => {
    if (!ref.current) return

    // Анімація масштабу при hover
    const targetScale = hovered ? 1.15 : 1
    easing.damp3(ref.current.scale, [targetScale, targetScale, targetScale], 0.1, delta)

    // Анімація radius та zoom для матеріалу (якщо використовується Image)
    if (ref.current.material && 'radius' in ref.current.material) {
      const targetRadius = hovered ? 0.25 : 0.1
      const targetZoom = hovered ? 1.15 : 1
      easing.damp(ref.current.material, 'radius', targetRadius, 0.2, delta)
      easing.damp(ref.current.material, 'zoom', targetZoom, 0.2, delta)
    }

    // Оновлення відео-текстури (відео не зупиняємо, щоб було видно одразу)
    if (mediaData.type === 'video' && mediaData.videoElement && mediaData.videoTexture) {
      mediaData.videoTexture.needsUpdate = true
    }
  })

  // Обчислюємо розміри та aspect ratio для обох типів медіа
  const videoAspect =
    mediaData.type === 'video' &&
    mediaData.videoElement &&
    mediaData.videoElement.videoWidth > 0 &&
    mediaData.videoElement.videoHeight > 0
      ? mediaData.videoElement.videoWidth / mediaData.videoElement.videoHeight
      : 16 / 9

  const imageAspect =
    mediaData.type === 'image' && mediaData.texture
      ? (() => {
          const img = mediaData.texture.image as { width?: number; height?: number } | undefined
          return img?.width && img?.height ? img.width / img.height : 1
        })()
      : 1

  const videoWidth = slideWidth
  const videoHeight = videoWidth / videoAspect

  const imageWidth = slideWidth
  const imageHeight = imageWidth / imageAspect

  // Створюємо геометрію для відео
  const videoGeometry = useMemo(() => {
    if (mediaData.type !== 'video') return null
    const shape = new THREE.Shape()
    const w = videoWidth / 2
    const h = videoHeight / 2
    // Радіус округлення: 15% від меншого розміру, але не менше baseCornerRadius
    const r = Math.max(baseCornerRadius, Math.min(w, h) * 0.15)

    // Створюємо скруглений прямокутник
    shape.moveTo(-w + r, -h)
    shape.lineTo(w - r, -h)
    shape.quadraticCurveTo(w, -h, w, -h + r)
    shape.lineTo(w, h - r)
    shape.quadraticCurveTo(w, h, w - r, h)
    shape.lineTo(-w + r, h)
    shape.quadraticCurveTo(-w, h, -w, h - r)
    shape.lineTo(-w, -h + r)
    shape.quadraticCurveTo(-w, -h, -w + r, -h)

    // Використовуємо ShapeGeometry для плоского слайду
    const geom = new THREE.ShapeGeometry(shape)

    // Виправляємо UV координати, щоб текстура правильно заповнювала весь слайд
    const positions = geom.attributes.position
    const uvs = new Float32Array(positions.count * 2)

    // Обчислюємо bounding box для нормалізації UV
    let minX = Infinity,
      maxX = -Infinity
    let minY = Infinity,
      maxY = -Infinity

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }

    // Нормалізуємо координати до [0, 1]
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      uvs[i * 2] = (x - minX) / (maxX - minX)
      uvs[i * 2 + 1] = 1 - (y - minY) / (maxY - minY) // Інвертуємо Y
    }

    geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    return geom
  }, [videoWidth, videoHeight, baseCornerRadius, mediaData.type])

  // Створюємо геометрію для зображення
  const imageGeometry = useMemo(() => {
    if (mediaData.type !== 'image') return null
    const shape = new THREE.Shape()
    const w = imageWidth / 2
    const h = imageHeight / 2
    // Радіус округлення: 15% від меншого розміру, але не менше baseCornerRadius
    const r = Math.max(baseCornerRadius, Math.min(w, h) * 0.15)

    // Створюємо скруглений прямокутник
    shape.moveTo(-w + r, -h)
    shape.lineTo(w - r, -h)
    shape.quadraticCurveTo(w, -h, w, -h + r)
    shape.lineTo(w, h - r)
    shape.quadraticCurveTo(w, h, w - r, h)
    shape.lineTo(-w + r, h)
    shape.quadraticCurveTo(-w, h, -w, h - r)
    shape.lineTo(-w, -h + r)
    shape.quadraticCurveTo(-w, -h, -w + r, -h)

    // Використовуємо ShapeGeometry для плоского слайду
    const geom = new THREE.ShapeGeometry(shape)

    // Виправляємо UV координати, щоб текстура правильно заповнювала весь слайд
    const positions = geom.attributes.position
    const uvs = new Float32Array(positions.count * 2)

    // Обчислюємо bounding box для нормалізації UV
    let minX = Infinity,
      maxX = -Infinity
    let minY = Infinity,
      maxY = -Infinity

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }

    // Нормалізуємо координати до [0, 1]
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      uvs[i * 2] = (x - minX) / (maxX - minX)
      uvs[i * 2 + 1] = 1 - (y - minY) / (maxY - minY) // Інвертуємо Y
    }

    geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    return geom
  }, [imageWidth, imageHeight, baseCornerRadius, mediaData.type])

  const pointerOver = (e: PointerEvent) => {
    e.stopPropagation()
    hover(true)
  }

  const pointerOut = () => {
    hover(false)
  }

  const handleClick = (e: PointerEvent) => {
    e.stopPropagation()
    // Тут можна додати логіку для кліку на слайд (наприклад, відкрити модальне вікно)
  }

  if (mediaData.type === 'video' && mediaData.videoTexture && videoGeometry) {
    return (
      <mesh
        ref={ref}
        position={position}
        rotation={rotation}
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
        onClick={handleClick}
        geometry={videoGeometry}
      >
        <meshBasicMaterial
          map={mediaData.videoTexture}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    )
  }

  if (mediaData.type === 'image' && mediaData.texture && imageGeometry) {
    return (
      <mesh
        ref={ref}
        position={position}
        rotation={rotation}
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
        onClick={handleClick}
        geometry={imageGeometry}
        scale={[-1, -1, 1]}
      >
        <meshBasicMaterial map={mediaData.texture} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    )
  }

  return null
}
