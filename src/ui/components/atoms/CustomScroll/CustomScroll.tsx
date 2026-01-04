'use client'

import { OverlayScrollbarsComponent, OverlayScrollbarsComponentRef } from 'overlayscrollbars-react'
import { useRef, useEffect } from 'react'

interface CustomScrollProps {
  children: React.ReactNode
  onScrollStateChange?: (state: { canScrollLeft: boolean; canScrollRight: boolean }) => void
  className?: string
}

export const CustomScroll = ({ children, className }: CustomScrollProps) => {
  const scrollRef = useRef<OverlayScrollbarsComponentRef<'div'>>(null)

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
      className={className}
    >
      {children}
    </OverlayScrollbarsComponent>
  )
}
