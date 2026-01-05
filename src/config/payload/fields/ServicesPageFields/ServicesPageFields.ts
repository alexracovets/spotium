import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { type Field } from 'payload'

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

export const ServicesPageFields = (): Field[] => {
  return [
    {
      type: 'group',
      name: 'services_type_fields',
      label: 'Поля для сторінки сервісів',
      admin: {
        condition: (data) => data.type === 'services',
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
          },
        },
        {
          name: 'services',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              label: {
                uk: 'Заголовок Професійного сервісу',
                en: 'Title of Professional Service',
              },
              admin: {
                description: {
                  uk: 'Заголовок професійного сервісу.',
                  en: 'Title of professional service.',
                },
              },
            },
            {
              name: 'description',
              type: 'richText',
              required: true,
              localized: true,
              label: {
                uk: 'Опис Професійного сервісу',
                en: 'Description of Professional Service',
              },
              admin: {
                description: {
                  uk: 'Опис професійного сервісу.',
                  en: 'Description of professional service.',
                },
              },
              editor: lexicalEditor({
                features: [
                  HeadingFeature({
                    enabledHeadingSizes: ['h1'],
                  }),
                  ParagraphFeature(),
                  BoldFeature(),
                  ItalicFeature(),
                  InlineToolbarFeature(),
                  IndentFeature(),
                  UnorderedListFeature(),
                  YellowHighlightFeature,
                ],
              }),
            },
          ],
        },
      ],
    },
  ]
}
