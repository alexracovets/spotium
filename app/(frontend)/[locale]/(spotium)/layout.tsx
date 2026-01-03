import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

import { LayoutSpotium } from '@templates'

import { Media, SiteSetting, LocalizationApp } from '@payload-types'
import { ChildrenType, SupportedLocaleType } from '@types'

interface LocaleLayoutProps extends ChildrenType {
  params: Promise<{ locale: SupportedLocaleType['name'] }>
}

// Кешовані функції для даних, які не залежать від локалі
const getCachedLogo = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const siteSettings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
      // Без locale - logo не локалізований
    })
    return siteSettings.logo as Media
  },
  ['site-settings-logo'],
  {
    revalidate: 3600, // Кешувати на 1 годину
  },
)

const getCachedLocalizations = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const localizations = await payload.findGlobal({
      slug: 'localization-app',
      depth: 1,
    })
    return localizations.lacales as LocalizationApp['lacales']
  },
  ['localization-app-lacales'],
  {
    revalidate: 3600, // Кешувати на 1 годину
  },
)

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  const payload = await getPayload({ config })

  // Отримуємо локалізовані дані з локаллю
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
    locale: locale,
  })

  // Отримуємо нелокалізовані дані з кешу
  const [logo, lacales] = await Promise.all([getCachedLogo(), getCachedLocalizations()])

  const animatedTexts = siteSettings.animatedTexts as SiteSetting['animatedTexts']
  const footer = siteSettings.footer as SiteSetting['footer']

  return (
    <LayoutSpotium
      logo={logo}
      animatedTexts={animatedTexts}
      footer={footer}
      lacales={lacales}
      locale={locale}
    >
      {children}
    </LayoutSpotium>
  )
}
