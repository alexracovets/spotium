'use client'

import { useEffect } from 'react'
import { useModel } from '@store'

/**
 * Хук для відстеження розмірів контейнера models_wrapper
 * Автоматично оновлює розміри в сторі при зміні розмірів елемента
 */
export const useModelsWrapperDimensions = () => {
  const { setModelsWrapperDimensions } = useModel()

  useEffect(() => {
    let observer: ResizeObserver | null = null
    let mutationObserver: MutationObserver | null = null
    let observedElement: HTMLElement | null = null
    let isDisposed = false
    let frameId: number | null = null
    const lastDimensionsRef = { width: 0, height: 0, x: 0, y: 0, hasValue: false }

    const scheduleUpdate = () => {
      if (frameId !== null) return
      frameId = window.requestAnimationFrame(() => {
        frameId = null
        updateDimensions()
      })
    }

    const updateDimensions = () => {
      if (isDisposed) return
      const element = document.getElementById('models_wrapper')
      const canvas = document.querySelector('canvas')
      if (element && canvas) {
        if (mutationObserver) {
          mutationObserver.disconnect()
          mutationObserver = null
        }
        const elementRect = element.getBoundingClientRect()
        const canvasRect = canvas.getBoundingClientRect()

        // Обчислюємо позицію та розміри відносно Canvas
        const x = elementRect.left - canvasRect.left
        const y = elementRect.top - canvasRect.top
        const width = elementRect.width
        const height = elementRect.height

        const hasChanged =
          !lastDimensionsRef.hasValue ||
          lastDimensionsRef.width !== width ||
          lastDimensionsRef.height !== height ||
          lastDimensionsRef.x !== x ||
          lastDimensionsRef.y !== y

        if (hasChanged) {
          lastDimensionsRef.width = width
          lastDimensionsRef.height = height
          lastDimensionsRef.x = x
          lastDimensionsRef.y = y
          lastDimensionsRef.hasValue = true
          setModelsWrapperDimensions(width, height, x, y)
        }

        if (!observer) {
          observer = new ResizeObserver(() => {
            scheduleUpdate()
          })
        }

        if (observedElement !== element) {
          if (observedElement) observer.unobserve(observedElement)
          observer.observe(element)
          observedElement = element
        }
      } else {
        if (!mutationObserver && document.body) {
          mutationObserver = new MutationObserver(() => {
            scheduleUpdate()
          })
          mutationObserver.observe(document.body, { childList: true, subtree: true })
        }
        if (observedElement && observer) {
          observer.unobserve(observedElement)
          observedElement = null
        }
        if (
          lastDimensionsRef.hasValue &&
          (lastDimensionsRef.width !== 0 ||
            lastDimensionsRef.height !== 0 ||
            lastDimensionsRef.x !== 0 ||
            lastDimensionsRef.y !== 0)
        ) {
          lastDimensionsRef.width = 0
          lastDimensionsRef.height = 0
          lastDimensionsRef.x = 0
          lastDimensionsRef.y = 0
          setModelsWrapperDimensions(0, 0, 0, 0)
        }
      }
    }

    // Початкове оновлення
    requestAnimationFrame(() => {
      updateDimensions()
    })

    // Також відстежуємо зміни розміру вікна та прокрутку
    const handleWindowChange = () => {
      scheduleUpdate()
    }

    window.addEventListener('resize', handleWindowChange)
    window.addEventListener('scroll', handleWindowChange, true)

    return () => {
      isDisposed = true
      if (mutationObserver) mutationObserver.disconnect()
      if (observer) observer.disconnect()
      window.removeEventListener('resize', handleWindowChange)
      window.removeEventListener('scroll', handleWindowChange, true)
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
        frameId = null
      }
    }
  }, [setModelsWrapperDimensions])
}
