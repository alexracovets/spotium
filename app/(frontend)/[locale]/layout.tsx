import { Wrapper } from '@atoms'

import { bebas_neue, jetbrains_mono, press_start_2p, anton } from '@fonts'
import { ChildrenType, LocalType } from '@types'
import { cn } from '@utils'

import '@styles/global.css'

interface RootLayoutProps extends ChildrenType {
  params: Promise<LocalType>
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params

  return (
    <html lang={locale} data-scroll-behavior={'smooth'}>
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
