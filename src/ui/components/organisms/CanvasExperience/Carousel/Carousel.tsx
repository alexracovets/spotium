'use client'

import { useMemo } from 'react'
import { useServicesSlider } from '@store'
import type { Box3, Vector3 } from 'three'
import { Vector3 as ThreeVector3 } from 'three'
import { usePreloadMedia } from './usePreloadMedia'
import { SlideCard } from './SlideCard'

type CarouselProps = {
  radius?: number
  modelScale?: number
  position?: Vector3 | null
  activeModel?: number
  showOnModel?: number
  boundingBox?: Box3 | null
}

export const Carousel = ({
  radius = 1.4,
  modelScale,
  position,
  activeModel,
  showOnModel = 2,
  boundingBox,
}: CarouselProps) => {
  const { slides } = useServicesSlider()
  const { loaded, mediaData } = usePreloadMedia(slides)
  const isVisible = Boolean(position) && activeModel === showOnModel
  const baseRadius = useMemo(() => {
    if (!boundingBox) return radius
    const size = boundingBox.getSize(new ThreeVector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    return (maxDim / 2) * 1.3
  }, [boundingBox, radius])
  const effectiveRadius = modelScale ? baseRadius * modelScale : baseRadius

  if (!isVisible || !loaded || slides.length === 0 || mediaData.length === 0) {
    return null
  }

  return (
    <group position={position?.toArray()}>
      {slides.map((slide, i) => {
        const data = mediaData.find((d) => d.media.id === slide.id)
        if (!data) return null

        const angle = (i / slides.length) * Math.PI * 2
        const x = Math.sin(angle) * effectiveRadius
        const z = Math.cos(angle) * effectiveRadius

        return (
          <SlideCard
            key={slide.id}
            mediaData={data}
            position={[x, 0, z]}
            rotation={[0, Math.PI + angle, 0]}
            totalSlides={slides.length}
            radius={effectiveRadius}
          />
        )
      })}
    </group>
  )
}
