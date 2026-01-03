import { getPayload } from 'payload'
import config from '@payload-config'

import { LayoutSpotium } from '@templates'

import { Media, SiteSetting, LocalizationApp } from '@payload-types'
import { ChildrenType, LocalType } from '@types'

interface LocaleLayoutProps extends ChildrenType {
  params: Promise<LocalType>
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  const payload = await getPayload({ config })

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
    locale,
  })

  const logo = siteSettings.logo as Media
  const animatedTexts = siteSettings.animatedTexts as SiteSetting['animatedTexts']
  const footer = siteSettings.footer as SiteSetting['footer']

  const localizations = await payload.findGlobal({
    slug: 'localization-app',
    depth: 1,
    locale,
  })

  const lacales = localizations.lacales as LocalizationApp['lacales']

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
