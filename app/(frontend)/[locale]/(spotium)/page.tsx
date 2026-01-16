import { notFound } from 'next/navigation'
import { Page } from '@payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

import { Main } from '@pages'

import { SupportedLocaleType } from '@types'

interface PagesPageProps {
  params: Promise<{
    locale: SupportedLocaleType['name']
  }>
}

export default async function PagesPage({ params }: PagesPageProps) {
  const { locale } = await params
  const payload = await getPayload({ config })

  const page = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    locale,
  })

  if (!page.docs || page.docs.length === 0) {
    notFound()
  }

  const data = page.docs[0] as Page

  return <Main data={data} locale={locale} />
}
