'use client'

import { AppHeader, AppFooter } from '@organisms'
import { NavigationSheet } from '@molecules'

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
      <main id="main-content" tabIndex={-1} className="min-h-0">
        {children}
      </main>
      <AppFooter footer={footer} lacales={lacales} locale={locale} />
    </>
  )
}

export { LayoutSpotium }
