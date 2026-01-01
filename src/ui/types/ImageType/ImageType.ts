'use client'

import { VariantProps } from 'class-variance-authority'
import { ComponentProps } from 'react'

import { variantsImage } from '@atoms'

import { Media } from '@payload-types'

export interface ImageType extends ComponentProps<'input'> {
  image?: Media
  src?: string
  alt?: string
  variant: VariantProps<typeof variantsImage>['variant']
  priority?: boolean
  className?: string
}
