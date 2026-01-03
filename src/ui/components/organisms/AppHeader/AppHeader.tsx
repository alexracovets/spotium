'use client'

import { memo } from 'react'

import { Logo } from '@molecules'

import type { Media, SiteSetting } from '@payload-types'
import { Container, Wrapper } from '@atoms'
import { AnimatedText, NavigationButton } from '@molecules'

type AppHeaderProps = {
  logo: Media
  animatedTexts?: SiteSetting['animatedTexts']
}

const AppHeader = memo(({ logo, animatedTexts }: AppHeaderProps) => {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-base-black focus:font-jetbrains_mono focus:uppercase focus:rounded focus:outline-2 focus:outline-primary focus:outline-offset-2"
      >
        Main content
      </a>
      <Container asChild>
        <header className="relative z-[51] bg-base-dark">
          <Wrapper variant="header" asChild>
            <Wrapper variant="heder_wrapper">
              <Logo image={logo} />
              <AnimatedText texts={animatedTexts} />
              <NavigationButton />
            </Wrapper>
          </Wrapper>
        </header>
      </Container>
    </>
  )
})

AppHeader.displayName = 'AppHeader'

export { AppHeader }
