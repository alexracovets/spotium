'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

interface GetPageCollectionProps {
  slug: string
  locale: string
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
    locale: locale as unknown as 'uk' | 'en',
  })

  return page
}
