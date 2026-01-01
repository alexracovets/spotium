'use client'

import { AppHeader, AppFooter } from '@organisms'
import { NavigationSheet } from '@molecules'
import { ChildrenType } from '@types'
import type { Media, SiteSetting } from '@payload-types'
import { useLayoutDimensions } from '@hooks'

type LayoutSpotiumProps = ChildrenType & {
  logo: Media
  animatedTexts?: SiteSetting['animatedTexts']
  footer: SiteSetting['footer']
}

const LayoutSpotium = ({ children, logo, animatedTexts, footer }: LayoutSpotiumProps) => {
  useLayoutDimensions()

  return (
    <>
      <AppHeader logo={logo} animatedTexts={animatedTexts} />
      <NavigationSheet />
      {children}
      <AppFooter footer={footer} />
    </>
  )
}

export { LayoutSpotium }
