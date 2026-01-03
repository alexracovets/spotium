import { Page } from '@payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

import { Main } from '@pages'

import { SupportedLocaleType } from '@types'

interface HomePageProps {
  params: Promise<{ locale: SupportedLocaleType['name'] }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params

  const payload = await getPayload({ config })

  const page = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: '/',
      },
    },
    locale: locale,
  })

  const data = page.docs[0] as Page

  return <Main data={data} />
}
