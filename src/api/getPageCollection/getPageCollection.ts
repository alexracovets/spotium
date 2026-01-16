'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { SupportedLocaleType } from '@types'

interface GetPageCollectionProps {
  slug: string
  locale: SupportedLocaleType['name']
}

export const getPageCollection = async ({ slug, locale }: GetPageCollectionProps) => {
  const payload = await getPayload({ config })
  const page = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    locale: locale,
  })

  return page
}
