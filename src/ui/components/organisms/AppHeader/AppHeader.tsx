'use client'

import { memo } from 'react'

import { Logo } from '@molecules'

import type { Media, SiteSetting } from '@payload-types'
import { Container, Wrapper } from '@atoms'
import { AnimatedText, NavigationButton } from '@molecules'
import { useMobile } from '@hooks'

type AppHeaderProps = {
  logo: Media
  animatedTexts?: SiteSetting['animatedTexts']
}

const AppHeader = memo(({ logo, animatedTexts }: AppHeaderProps) => {
  const isMobile = useMobile()
  return (
    <Container asChild>
      <header className="relative z-51 bg-base-dark">
        <Wrapper variant="header" asChild>
          <Wrapper variant="heder_wrapper">
            <Logo image={logo} />
            {isMobile === false && <AnimatedText texts={animatedTexts} />}
            <NavigationButton />
          </Wrapper>
        </Wrapper>
      </header>
    </Container>
  )
})

AppHeader.displayName = 'AppHeader'

export { AppHeader }
