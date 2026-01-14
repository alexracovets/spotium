import { notFound } from 'next/navigation'
import { Case } from '@payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'
import { CollectionSlug } from 'payload'

import { CaseItem } from '@pages'

import { SupportedLocaleType } from '@types'

interface ElementsPageProps {
  params: Promise<{
    locale: SupportedLocaleType['name']
    pages?: string
    elements?: string
  }>
}

export default async function ElementsPage({ params }: ElementsPageProps) {
  const { locale, pages, elements } = await params
  const payload = await getPayload({ config })

  const collectionFindByPage = (page: string) => {
    if (page === 'cases') {
      return 'cases'
    } else {
      return 'oops'
    }
  }

  const collection = collectionFindByPage(pages as string) as CollectionSlug

  const page = await payload.find({
    collection: collection,
    where: {
      slug_name: {
        equals: elements,
      },
    },
    locale,
  })

  if (!page.docs || page.docs.length === 0) {
    notFound()
  }

  const data = page.docs[0] as Case

  switch (collection) {
    case 'cases':
      return <CaseItem data={data} />
    default:
      return notFound()
  }
}
