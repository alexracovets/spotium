'use client'

import { AppHeader, AppFooter } from '@organisms'
import { NavigationSheet } from '@molecules'
import { Container } from '@atoms'

import type { Media, SiteSetting } from '@payload-types'
import { useLayoutDimensions } from '@hooks'
import { ChildrenType } from '@types'

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
      <Container asChild>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </Container>
      <AppFooter footer={footer} />
    </>
  )
}

export { LayoutSpotium }
