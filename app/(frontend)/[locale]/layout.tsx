import { GlobalParams } from '@atoms'
import { ChildrenType, SupportedLocaleType } from '@types'

interface LocaleLayoutProps extends ChildrenType {
  params: Promise<{ locale: SupportedLocaleType['name'] }>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  return (
    <>
      <GlobalParams locale={locale} />
      {children}
    </>
  )
}
