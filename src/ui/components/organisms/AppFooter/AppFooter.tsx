'use client'

import { Container, Wrapper, Text } from '@atoms'
import { Localization } from '@molecules'

import type { SiteSetting, LocalizationApp } from '@payload-types'

type AppFooterProps = {
  footer: SiteSetting['footer']
  lacales: LocalizationApp['lacales']
}

const AppFooter = ({ footer, lacales }: AppFooterProps) => {
  return (
    <Container asChild>
      <footer className="relative z-[51] bg-base-dark">
        <Wrapper variant="footer">
          <Text variant="footer">{footer}</Text>
          <Localization lacales={lacales} />
        </Wrapper>
      </footer>
    </Container>
  )
}

export { AppFooter }
