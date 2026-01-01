'use client'

import { VariantProps } from 'class-variance-authority'
import { variantText } from '@atoms'

export interface TextType {
  variant?: VariantProps<typeof variantText>['variant']
  className?: string
  asChild?: boolean
  children?: React.ReactNode
}
