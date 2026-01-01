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
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (texts?.length && texts.length <= 1) return
    const timer = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % (texts?.length || 0))
        setIsVisible(true)
      }, 300)
    }, interval)

    return () => clearInterval(timer)
  }, [texts?.length, interval])

  const currentText = texts?.[currentIndex]

  return (
    <Wrapper variant="animated_text" className={className}>
      <Text variant="animated_text_first_word" asChild data-active={isVisible}>
        <span>{currentText?.firstWord}</span>
      </Text>
      <Text variant="animated_text_second_word" asChild data-active={isVisible}>
        <span>{currentText?.secondWord}</span>
      </Text>
    </Wrapper>
  )
}

export { AnimatedText }
