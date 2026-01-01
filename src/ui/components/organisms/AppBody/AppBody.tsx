'use client'

import { bebas_neue, jetbrains_mono } from '@fonts'
import { ChildrenType } from '@types'
import { cn } from '@utils'

import '@styles/global.css'

export const AppBody = ({ children }: ChildrenType) => {
  return (
    <body className={cn(bebas_neue.variable, jetbrains_mono.variable, 'antialiased')}>
      {children}
    </body>
  )
}
