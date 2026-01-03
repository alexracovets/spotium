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
// Використовуємо один екземпляр Payload для всіх операцій
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
    tags: ['site-settings'],
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
    tags: ['localization-app'],
  },
)

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  // Отримуємо нелокалізовані дані з кешу та локалізовані дані паралельно
  const [logo, lacales, siteSettings] = await Promise.all([
    getCachedLogo(),
    getCachedLocalizations(),
    (async () => {
      const payload = await getPayload({ config })
      return payload.findGlobal({
        slug: 'site-settings',
        depth: 1,
        locale: locale,
      })
    })(),
  ])

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
