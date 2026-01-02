import { Wrapper } from '@atoms'

import { bebas_neue, jetbrains_mono, press_start_2p, anton } from '@fonts'
import { ChildrenType } from '@types'
import { cn } from '@utils'

import '@styles/global.css'

export default function RootLayout({ children }: ChildrenType) {
  return (
    <html lang="uk" data-scroll-behavior={'smooth'}>
      <Wrapper variant="app" asChild>
        <body
          suppressHydrationWarning
          className={cn(
            jetbrains_mono.variable,
            press_start_2p.variable,
            bebas_neue.variable,
            anton.variable,
          )}
        >
          {children}
        </body>
      </Wrapper>
    </html>
  )
}
