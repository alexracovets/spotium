'use client'

import { Container, Wrapper, Text } from '@atoms'

import type { SiteSetting } from '@payload-types'

type AppFooterProps = {
  footer: SiteSetting['footer']
}

const AppFooter = ({ footer }: AppFooterProps) => {
  return (
    <Container asChild>
      <footer className="relative z-[51] bg-base-dark">
        <Wrapper variant="footer">
          <Text variant="footer">{footer}</Text>
        </Wrapper>
      </footer>
    </Container>
  )
}

export { AppFooter }
