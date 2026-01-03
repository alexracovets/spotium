import { Page } from '@payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

import { Main } from '@pages'

import { SupportedLocaleType } from '@types'

interface PagesPageProps {
  params: Promise<{
    locale: SupportedLocaleType['name']
    pages: Page['slug']
  }>
}

export default async function PagesPage({ params }: PagesPageProps) {
  const { locale, pages } = await params

  const payload = await getPayload({ config })

  const page = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: pages === '' ? 'home' : pages,
      },
    },
    locale,
  })

  const data = page.docs[0] as Page
  
  switch (data.type) {
    case 'main':
      return <Main data={data} />
    default:
      return <div>Page not found</div>
  }
}
