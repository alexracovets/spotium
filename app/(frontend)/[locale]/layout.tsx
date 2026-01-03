import { Wrapper } from '@atoms'

import { bebas_neue, jetbrains_mono, press_start_2p, anton, dm_sans } from '@fonts'
import { ChildrenType, SupportedLocaleType } from '@types'
import { cn } from '@utils'

import '@styles/global.css'

interface RootLayoutProps extends ChildrenType {
  params: Promise<{ locale: SupportedLocaleType['name'] }>
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
            dm_sans.variable,
          )}
        >
          {children}
        </body>
      </Wrapper>
    </html>
  )
}
