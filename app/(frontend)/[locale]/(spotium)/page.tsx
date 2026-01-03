import { Page } from '@payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import { Main } from '@pages'

import { SupportedLocaleType } from '@types'

interface HomePageProps {
  params: Promise<{ locale: SupportedLocaleType['name'] }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params

  // Використовуємо кешовану функцію з унікальним ключем для кожної локалі
  const getCachedPage = unstable_cache(
    async () => {
      const payload = await getPayload({ config })
      const page = await payload.find({
        collection: 'pages',
        where: {
          slug: {
            equals: '/',
          },
        },
        locale: locale as SupportedLocaleType['name'],
      })
      return page.docs[0] as Page | undefined
    },
    [`home-page-${locale}`], // Унікальний ключ для кожної локалі
    {
      revalidate: 60, // Кешувати на 1 хвилину
      tags: ['pages', `pages-${locale}`],
    },
  )

  const data = await getCachedPage()

  if (!data) {
    return <div>Page not found</div>
  }

  return <Main data={data} />
}
