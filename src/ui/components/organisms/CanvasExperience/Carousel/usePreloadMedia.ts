'use client'

import { useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { Media } from '@payload-types'

type MediaData = {
  type: 'image' | 'video'
  texture?: THREE.Texture
  videoElement?: HTMLVideoElement
  videoTexture?: THREE.VideoTexture
  media: Media
}

type UsePreloadMediaReturn = {
  loaded: boolean
  mediaData: MediaData[]
  error: Error | null
}

export const usePreloadMedia = (slides: Media[]): UsePreloadMediaReturn => {
  const [loaded, setLoaded] = useState(false)
  const [mediaData, setMediaData] = useState<MediaData[]>([])
  const [error, setError] = useState<Error | null>(null)
  const loadingRef = useRef(false)

  useEffect(() => {
    if (!slides || slides.length === 0) {
      setLoaded(true)
      setMediaData([])
      loadingRef.current = false
      return
    }

    // Скидаємо стан при зміні slides
    setLoaded(false)
    setMediaData([])
    loadingRef.current = false

    const loadMedia = async () => {
      if (loadingRef.current) return
      loadingRef.current = true

      try {
        const loader = new THREE.TextureLoader()
        // Використовуємо Map для збереження порядку
        const dataMap = new Map<number, MediaData>()
        let loadedCount = 0
        const totalCount = slides.length

        const checkComplete = () => {
          loadedCount++
          if (loadedCount === totalCount) {
            // Конвертуємо Map в масив, зберігаючи порядок slides
            const data = slides
              .map((slide) => dataMap.get(slide.id))
              .filter((item): item is MediaData => item !== undefined)
            setMediaData(data)
            setLoaded(true)
          }
        }

        for (const slide of slides) {
          if (!slide.url) {
            checkComplete()
            continue
          }

          const mimeType = slide.mimeType || ''
          const isVideo = mimeType.startsWith('video/')

          if (isVideo) {
            // Завантаження відео
            const video = document.createElement('video')
            video.crossOrigin = 'anonymous'
            video.loop = true
            video.muted = true
            video.playsInline = true
            video.preload = 'auto'

            video.addEventListener('loadeddata', () => {
              const videoTexture = new THREE.VideoTexture(video)
              videoTexture.minFilter = THREE.LinearFilter
              videoTexture.magFilter = THREE.LinearFilter
              videoTexture.format = THREE.RGBAFormat

              dataMap.set(slide.id, {
                type: 'video',
                videoElement: video,
                videoTexture,
                media: slide,
              })

              // Автовідтворення, щоб слайд був видимий без hover
              video.play().catch(() => {
                // Ігноруємо помилки автоплею (браузерні обмеження)
              })

              checkComplete()
            })

            video.addEventListener('error', () => {
              console.error(`Failed to load video: ${slide.url}`)
              checkComplete()
            })

            video.src = slide.url
            video.load()
          } else {
            // Завантаження зображення
            loader.load(
              slide.url,
              (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace
                dataMap.set(slide.id, {
                  type: 'image',
                  texture,
                  media: slide,
                })
                checkComplete()
              },
              undefined,
              (err) => {
                console.error(`Failed to load image: ${slide.url}`, err)
                checkComplete()
              },
            )
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setLoaded(true)
      }
    }

    loadMedia()
  }, [slides])

  return { loaded, mediaData, error }
}
