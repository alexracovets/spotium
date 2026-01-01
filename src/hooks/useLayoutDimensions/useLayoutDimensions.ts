'use client'

import { useEffect } from 'react'

/**
 * Хук для оновлення CSS змінних висоти header та footer
 * Автоматично оновлює --header-height та --footer-height при зміні розмірів
 */
export const useLayoutDimensions = () => {
  useEffect(() => {
    const updateCSSVariables = () => {
      const header = document.querySelector('header')
      const footer = document.querySelector('footer')

      if (header) {
        const headerHeight = header.offsetHeight
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`)
      }

      if (footer) {
        const footerHeight = footer.offsetHeight
        document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`)
      }
    }

    requestAnimationFrame(() => {
      updateCSSVariables()
    })

    window.addEventListener('resize', updateCSSVariables)

    const observer = new ResizeObserver(updateCSSVariables)
    const header = document.querySelector('header')
    const footer = document.querySelector('footer')

    if (header) observer.observe(header)
    if (footer) observer.observe(footer)

    return () => {
      window.removeEventListener('resize', updateCSSVariables)
      observer.disconnect()
    }
  }, [])
}
