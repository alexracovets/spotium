import { Page } from '@payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

import { Main } from '@pages'

import { SupportedLocaleType } from '@types'

interface PagesPageProps {
  params: Promise<{
    locale: SupportedLocaleType['name']
    pages?: string[]
  }>
}

export default async function PagesPage({ params }: PagesPageProps) {
  const { locale, pages } = await params

  const payload = await getPayload({ config })

  // Визначаємо slug: якщо pages undefined або порожній масив, то використовуємо 'home'
  // Якщо pages є масивом, беремо перший елемент (для вкладених шляхів)
  const slug = !pages || pages.length === 0 ? 'home' : pages[0]

  const page = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    locale,
  })

  // Перевіряємо, чи знайдено сторінку
  if (!page.docs || page.docs.length === 0) {
    return (
      <div>
        <h1>404 - Сторінка не знайдена</h1>
        <p>Сторінка зі slug &quot;{slug}&quot; не існує</p>
      </div>
    )
  }

  const data = page.docs[0] as Page
  return <Main data={data} />
}
