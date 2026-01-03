'use client'

import { memo } from 'react'

import { Container, Wrapper, Text } from '@atoms'
import { Localization } from '@molecules'

import type { SiteSetting, LocalizationApp } from '@payload-types'

type AppFooterProps = {
  footer: SiteSetting['footer']
  lacales: LocalizationApp['lacales']
  locale?: string
}

const AppFooter = memo(({ footer, lacales, locale }: AppFooterProps) => {
  return (
    <Container asChild>
      <footer className="relative z-[51] bg-base-dark">
        <Wrapper variant="footer">
          <Text variant="footer">{footer}</Text>
          <Localization lacales={lacales} currentLocale={locale} />
        </Wrapper>
      </footer>
    </Container>
  )
})

AppFooter.displayName = 'AppFooter'

export { AppFooter }
