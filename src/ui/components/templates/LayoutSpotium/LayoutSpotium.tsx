'use client'

import { AppHeader, AppFooter, CanvasExperience } from '@organisms'
import { NavigationSheet } from '@molecules'
import { Container } from '@atoms'

import type { Media, SiteSetting, LocalizationApp } from '@payload-types'
import { useLayoutDimensions, useLocaleLang } from '@hooks'
import { ChildrenType } from '@types'

type LayoutSpotiumProps = ChildrenType & {
  logo: Media
  animatedTexts?: SiteSetting['animatedTexts']
  footer: SiteSetting['footer']
  lacales: LocalizationApp['lacales']
  locale?: string
}

const LayoutSpotium = ({
  children,
  logo,
  animatedTexts,
  footer,
  lacales,
  locale,
}: LayoutSpotiumProps) => {
  useLayoutDimensions()
  useLocaleLang()

  return (
    <>
      <AppHeader logo={logo} animatedTexts={animatedTexts} />
      <NavigationSheet />
      <Container asChild>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </Container>
      <AppFooter footer={footer} lacales={lacales} locale={locale} />
      <CanvasExperience />
    </>
  )
}

export { LayoutSpotium }
