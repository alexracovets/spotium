import { getPayload } from 'payload'
import config from '@payload-config'

import { LayoutSpotium } from '@templates'

import { Media } from '@payload-types'
import { ChildrenType } from '@types'

export default async function RootLayout({ children }: ChildrenType) {
  const payload = await getPayload({ config })

  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
  })

  const logo = siteSettings.logo as Media

  return <LayoutSpotium logo={logo}>{children}</LayoutSpotium>
}
