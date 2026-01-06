'use client'

import { useEffect, useState } from 'react'
import { Media, Page } from '@payload-types'
import { useServicesSlider } from '@store'

type ServicesProps = {
  items: NonNullable<NonNullable<Page['services_type_fields']>['services']>[number]['media'][]
}

export const useGetServicesMedia = ({ items }: ServicesProps) => {
  const { setSlides, slides } = useServicesSlider()
  useEffect(() => {
    if (items && Array.isArray(items) && slides.length === 0) {
      setSlides(items.map((item) => item as Media))
    }
  }, [items, setSlides, slides])
  return null
}
