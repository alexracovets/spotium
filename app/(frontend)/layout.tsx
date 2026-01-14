import { CanvasExperience } from '@organisms'
import { Wrapper } from '@atoms'

import { bebas_neue, jetbrains_mono, press_start_2p, noto_sans } from '@fonts'
import { ChildrenType } from '@types'
import { cn } from '@utils'

import '@styles/global.css'

export default function FrontendRootLayout({ children }: ChildrenType) {
  return (
    <html lang="en" data-scroll-behavior={'smooth'}>
      <Wrapper variant="app" asChild>
        <body
          suppressHydrationWarning
          className={cn(
            press_start_2p.variable,
            bebas_neue.variable,
            noto_sans.variable,
            jetbrains_mono.variable,
          )}
        >
          {children}
          <CanvasExperience />
        </body>
      </Wrapper>
    </html>
  )
}
