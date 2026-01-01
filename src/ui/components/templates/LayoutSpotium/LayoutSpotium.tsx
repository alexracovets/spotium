'use client'

import { AppHeader, AppFooter } from '@organisms'
import { ChildrenType } from '@types'

export const LayoutSpotium = ({ children }: ChildrenType) => {
  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>
  )
}
