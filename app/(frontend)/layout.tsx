import { Wrapper } from '@atoms'

import { bebas_neue, jetbrains_mono, press_start_2p } from '@fonts'
import { ChildrenType } from '@types'
import { cn } from '@utils'

import '@styles/global.css'

export default function RootLayout({ children }: ChildrenType) {
  return (
    <html lang="uk" data-scroll-behavior={'smooth'}>
      <Wrapper variant="app" asChild>
        <body suppressHydrationWarning className={cn(bebas_neue.className, jetbrains_mono.className, press_start_2p.className)}>
          {children}
        </body>
      </Wrapper>
    </html>
  )
}
