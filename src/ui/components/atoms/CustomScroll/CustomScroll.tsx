'use client'

import { OverlayScrollbarsComponent, OverlayScrollbarsComponentRef } from 'overlayscrollbars-react'
import { useRef, useEffect } from 'react'

import { cn } from '@utils'

interface CustomScrollProps {
  children: React.ReactNode
  onScrollStateChange?: (state: { canScrollLeft: boolean; canScrollRight: boolean }) => void
  className?: string
  isTrigger?: boolean
  setIsTrigger?: (isTrigger: boolean) => void
}

export const CustomScroll = ({
  children,
  className,
  isTrigger,
  setIsTrigger,
}: CustomScrollProps) => {
  const scrollRef = useRef<OverlayScrollbarsComponentRef<'div'>>(null)

  // Функція для оновлення скролу
  const updateScroll = () => {
    const instance = scrollRef.current?.osInstance()
    if (instance) {
      instance.update(true)
    }
  }

  // Оновлення при зміні isTrigger з затримкою для очікування анімації акордіону
  useEffect(() => {
    if (!isTrigger) return

    // Затримка ~350ms для очікування завершення анімації акордіону
    const timeoutId = setTimeout(() => {
      updateScroll()
      setIsTrigger?.(false)
    }, 350)

    return () => clearTimeout(timeoutId)
  }, [isTrigger, setIsTrigger])

  // ResizeObserver для автоматичного оновлення при зміні розміру контенту
  useEffect(() => {
    const osInstance = scrollRef.current?.osInstance()
    if (!osInstance) return

    const viewportElement = osInstance.elements().viewport
    if (!viewportElement) return

    // Знаходимо контент всередині viewport
    const contentElement = viewportElement.firstElementChild as HTMLElement
    if (!contentElement) return

    // Debounce для оптимізації
    let timeoutId: NodeJS.Timeout
    const debouncedUpdate = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        updateScroll()
      }, 50)
    }

    // Відстежуємо зміни розміру контенту
    const observer = new ResizeObserver(debouncedUpdate)
    observer.observe(contentElement)

    // Також відстежуємо зміни розміру viewport
    const viewportObserver = new ResizeObserver(debouncedUpdate)
    viewportObserver.observe(viewportElement)

    return () => {
      observer.disconnect()
      viewportObserver.disconnect()
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    // access scrollable element through keyboard
    const timeoutId = setTimeout(() => {
      const osInstance = scrollRef.current?.osInstance()
      if (osInstance) {
        const viewportElement = osInstance.elements().viewport
        if (viewportElement) {
          viewportElement.setAttribute('tabindex', '0')
        }
      }
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <OverlayScrollbarsComponent
      ref={scrollRef}
      options={{
        scrollbars: {
          theme: 'os-theme-custom',
          clickScroll: false,
          autoHide: 'never',
        },
      }}
      className={cn('h-full w-full', className)}
    >
      {children}
    </OverlayScrollbarsComponent>
  )
}
