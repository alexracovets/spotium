'use client'

import { VariantProps } from 'class-variance-authority'
import { ComponentProps, CSSProperties } from 'react'
import { variantWrapper } from '@atoms'

export interface WrapperType extends ComponentProps<'div'> {
  variant?: VariantProps<typeof variantWrapper>['variant']
  asChild?: boolean
  style?: CSSProperties
}
