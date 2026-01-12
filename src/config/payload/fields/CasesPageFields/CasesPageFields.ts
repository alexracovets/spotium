import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { type Field } from 'payload'
import { Case } from '@payload-types'

import {
  InlineToolbarFeature,
  UnorderedListFeature,
  ParagraphFeature,
  HeadingFeature,
  ItalicFeature,
  IndentFeature,
  BoldFeature,
} from '@payloadcms/richtext-lexical'

import { YellowHighlightFeature } from '@features'

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
          label: 'Відображати Елементи',
          type: 'relationship',
          relationTo: 'cases',
          hasMany: true,
          required: false,
          filterOptions: ({ siblingData }) => {
            if (!siblingData || !(siblingData as Case).slug) {
              return false
            }
            return {
              slug: {
                like: `${(siblingData as Case).slug}/%`,
              },
            }
          },
        },
      ],
    },
  ]
}
