'use client'

import { Media } from '@payload-types'
import { create } from 'zustand'

type ServicesSliderStore = {
  activeSlideIndex: number
  slides: Media[]
  setActiveSlideIndex: (activeSlideIndex: number) => void
  setSlides: (slides: Media[]) => void
}

export const useServicesSlider = create<ServicesSliderStore>((set) => ({
  activeSlideIndex: 0,
  slides: [],
  setActiveSlideIndex: (activeSlideIndex: number) => {
    set({ activeSlideIndex: activeSlideIndex })
  },
  setSlides: (slides: Media[]) => {
    set({ slides: slides })
  },
}))
