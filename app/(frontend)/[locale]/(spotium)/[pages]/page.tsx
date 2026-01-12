import { notFound } from 'next/navigation'
import { Page } from '@payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

import { Cases, Main, Services } from '@pages'

import { SupportedLocaleType } from '@types'

interface PagesPageProps {
  params: Promise<{
    locale: SupportedLocaleType['name']
    pages?: string
  }>
}

export default async function PagesPage({ params }: PagesPageProps) {
  const { locale, pages } = await params
  const payload = await getPayload({ config })

  const page = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: pages,
      },
    },
    locale,
  })

  if (!page.docs || page.docs.length === 0) {
    notFound()
  }

  const data = page.docs[0] as Page

  switch (data.type) {
    case 'main':
      return <Main data={data} />
    case 'services':
      return <Services data={data} />
    case 'cases':
      return <Cases data={data} />
    default:
      return <div>Page not found</div>
  }
}
