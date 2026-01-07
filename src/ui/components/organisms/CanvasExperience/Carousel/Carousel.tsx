'use client'

import { useServicesSlider } from '@store'
import { usePreloadMedia } from './usePreloadMedia'
import { SlideCard } from './SlideCard'

type CarouselProps = {
  radius?: number
}

export const Carousel = ({ radius = 1.4 }: CarouselProps) => {
  const { slides } = useServicesSlider()
  const { loaded, mediaData } = usePreloadMedia(slides)

  if (!loaded || slides.length === 0 || mediaData.length === 0) {
    return null
  }

  return (
    <>
      {slides.map((slide, i) => {
        const data = mediaData.find((d) => d.media.id === slide.id)
        if (!data) return null

        const angle = (i / slides.length) * Math.PI * 2
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius

        return (
          <SlideCard
            key={slide.id}
            mediaData={data}
            position={[x, 0, z]}
            rotation={[0, Math.PI + angle, 0]}
            totalSlides={slides.length}
            radius={radius}
          />
        )
      })}
    </>
  )
}
