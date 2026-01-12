import { FilterOptionsProps, Where, type Field } from 'payload'
import { Case } from '@payload-types'

export const CasesPageFields = (): Field[] => {
  return [
    {
      type: 'group',
      name: 'cases_type_fields',
      label: 'Поля для сторінки кейсів',
      admin: {
        condition: (data) => data.type === 'cases',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: {
            uk: 'Заголовок',
            en: 'Title',
          },
          admin: {
            description: {
              uk: 'Основний заголовок сторінки.',
              en: 'Main page title.',
            },
            width: '50%',
          },
        },
        {
          name: 'elements',
          label: {
            uk: 'Відображати Кейси',
            en: 'Display Cases',
          },
          type: 'relationship',
          relationTo: 'cases',
          hasMany: true,
          required: false,
          filterOptions: ({ siblingData, id }: FilterOptionsProps<Case>): boolean | Where => {
            const pageId = id ?? (siblingData as Case)?.id
            const pageSlug = (siblingData as Case)?.slug ?? (siblingData as Case)?.slug_name

            const conditions: Where[] = []
            if (pageId) conditions.push({ parent: { equals: pageId } })
            if (pageSlug) conditions.push({ slug: { like: `${pageSlug}/%` } })

            if (!conditions.length) return false
            return conditions.length === 1 ? conditions[0] : { or: conditions }
          },
        },
      ],
    },
  ]
}
