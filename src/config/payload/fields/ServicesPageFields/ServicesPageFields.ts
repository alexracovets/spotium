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
          type: 'row',
          fields: [
            {
              name: 'button',
              type: 'text',
              localized: true,
              label: {
                uk: 'Текст кнопки',
                en: 'Button text',
              },
              admin: {
                description: {
                  uk: 'Кнопка форми для консультації',
                  en: 'Consultation form button',
                },
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'services',
          type: 'array',
          label: {
            uk: 'Професійні сервіси',
            en: 'Professional Services',
          },
          labels: {
            singular: {
              uk: 'Професійний сервіс',
              en: 'Professional Service',
            },
            plural: {
              uk: 'Професійні сервіси',
              en: 'Professional Services',
            },
          },
          fields: [
            {
              type: 'row',
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
                    width: '50%',
                  },
                },
                {
                  name: 'media',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: {
                    uk: 'Медіа файл',
                    en: 'Media file',
                  },
                  admin: {
                    description: {
                      uk: 'Медіа файл для слайдера',
                      en: 'Media file for slider',
                    },
                    width: '50%',
                  },
                },
              ],
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
