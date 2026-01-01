'use client'

import { VariantProps } from 'class-variance-authority'
import { ComponentProps } from 'react'

import { buttonVariants } from '@atoms'

export interface ButtonType extends ComponentProps<'button'> {
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  asChild?: boolean
}
