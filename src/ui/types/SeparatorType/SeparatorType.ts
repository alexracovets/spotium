'use client'

import * as SeparatorPrimitive from '@radix-ui/react-separator'

import { ComponentProps } from 'react'

export interface SeparatorType extends ComponentProps<typeof SeparatorPrimitive.Root> {
  orientation?: 'horizontal' | 'vertical'
}
