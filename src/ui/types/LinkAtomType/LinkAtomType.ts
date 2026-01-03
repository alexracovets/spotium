'use client'

import { VariantProps } from 'class-variance-authority'
import { variantsLinkAtom } from '@atoms'

export interface LinkAtomType {
  variant?: VariantProps<typeof variantsLinkAtom>['variant']
  className?: string
  children?: React.ReactNode
  href: string
  style?: React.CSSProperties
  target?: string
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}
