import { cn } from '@lib'
import { getLocale } from '@/utils/locale/locale'

import { bebas_neue, jetbrains_mono } from '@fonts'

export const LayoutDefault = async ({ children }: { children: React.ReactNode }) => {
  const locale = await getLocale()

  return (
    <html lang={locale} data-scroll-behavior={'smooth'}>
      <body className={cn(bebas_neue.variable, jetbrains_mono.variable, 'antialiased')}>
        {children}
      </body>
    </html>
  )
}
