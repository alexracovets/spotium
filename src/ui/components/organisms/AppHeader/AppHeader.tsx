'use client'

import { Logo } from '@molecules'

import type { Media, SiteSetting } from '@payload-types'
import { Container, Wrapper } from '@atoms'
import { AnimatedText } from '@molecules'

type AppHeaderProps = {
  logo: Media
  animatedTexts?: SiteSetting['animatedTexts']
}

const AppHeader = ({ logo, animatedTexts }: AppHeaderProps) => {
  return (
    <Container asChild>
      <header>
        <Wrapper variant="header" asChild>
          <Wrapper variant="heder_wrapper">
            <Logo image={logo} />
            <AnimatedText texts={animatedTexts} />
            <div></div>
          </Wrapper>
        </Wrapper>
      </header>
    </Container>
  )
}

export { AppHeader }
