import { Wrapper } from '@atoms'
import { CanvasExperience } from '@organisms'
import { bebas_neue, jetbrains_mono, press_start_2p, anton, dm_sans } from '@fonts'
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
            jetbrains_mono.variable,
            press_start_2p.variable,
            bebas_neue.variable,
            anton.variable,
            dm_sans.variable,
          )}
        >
          {children}
          <CanvasExperience />
        </body>
      </Wrapper>
    </html>
  )
}
