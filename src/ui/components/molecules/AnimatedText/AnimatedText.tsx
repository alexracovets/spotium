'use client'

import { useEffect, useState } from 'react'

import { Wrapper, Text } from '@atoms'

import type { SiteSetting } from '@payload-types'

type AnimatedTextProps = {
  texts: SiteSetting['animatedTexts']
  interval?: number
  className?: string
}

const AnimatedText = ({ texts, interval = 6000, className }: AnimatedTextProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (texts?.length && texts.length <= 1) return
    if (prefersReducedMotion) return

    const timer = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % (texts?.length || 0))
        setIsVisible(true)
      }, 300)
    }, interval)

    return () => clearInterval(timer)
  }, [texts?.length, interval, prefersReducedMotion])

  const currentText = texts?.[currentIndex]

  return (
    <Wrapper variant="animated_text" className={className}>
      <Text variant="animated_text" asChild data-active={isVisible}>
        <span>{currentText?.firstWord}</span>
      </Text>
      <Text variant="animated_text" className="text-primary" asChild data-active={isVisible}>
        <span>{currentText?.secondWord}</span>
      </Text>
    </Wrapper>
  )
}

export { AnimatedText }
