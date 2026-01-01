'use client'

import { Logo } from '@molecules'

import type { Media } from '@payload-types'
import { Container, Wrapper } from '@atoms'

type AppHeaderProps = {
  logo: Media
}

const AppHeader = ({ logo }: AppHeaderProps) => {
  return (
    <Container asChild>
      <header>
        <Wrapper variant="header">
          <Logo image={logo} />
        </Wrapper>
      </header>
    </Container>
  )
}

export { AppHeader }
