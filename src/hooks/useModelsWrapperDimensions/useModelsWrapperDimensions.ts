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
    const updateDimensions = () => {
      const element = document.getElementById('models_wrapper')
      const canvas = document.querySelector('canvas')
      if (element && canvas) {
        const elementRect = element.getBoundingClientRect()
        const canvasRect = canvas.getBoundingClientRect()

        // Обчислюємо позицію та розміри відносно Canvas
        const x = elementRect.left - canvasRect.left
        const y = elementRect.top - canvasRect.top
        const width = elementRect.width
        const height = elementRect.height

        setModelsWrapperDimensions(width, height, x, y)
      }
    }

    // Початкове оновлення
    requestAnimationFrame(() => {
      updateDimensions()
    })

    // Відстеження змін розміру через ResizeObserver
    const element = document.getElementById('models_wrapper')
    if (!element) return

    const observer = new ResizeObserver(() => {
      updateDimensions()
    })

    observer.observe(element)

    // Також відстежуємо зміни розміру вікна та прокрутку
    window.addEventListener('resize', updateDimensions)
    window.addEventListener('scroll', updateDimensions, true)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateDimensions)
      window.removeEventListener('scroll', updateDimensions, true)
    }
  }, [setModelsWrapperDimensions])
}
