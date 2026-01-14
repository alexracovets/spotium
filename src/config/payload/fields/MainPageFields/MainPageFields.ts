import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { type Field } from 'payload'

import {
  InlineToolbarFeature,
  ParagraphFeature,
  HeadingFeature,
  ItalicFeature,
  IndentFeature,
  BoldFeature,
} from '@payloadcms/richtext-lexical'

import { YellowHighlightFeature } from '@features'

export const MainPageFields = (): Field[] => {
  return [
    {
      type: 'group',
      name: 'main_type_fields',
      label: 'Поля для основної сторінки',
      admin: {
        condition: (data) => data.type === 'main',
      },
      fields: [
        {
          name: 'title_main',
          type: 'richText',
          localized: true,
          label: {
            uk: 'Заголовок',
            en: 'Title',
          },
          admin: {
            condition: (data) => data.type === 'main',
            description: {
              uk: 'Основний заголовок сторінки. Виділіть текст та використайте кнопку "Жовте виділення" для виділення частини тексту жовтим кольором.',
              en: 'Main page title. Select text and use the "Yellow highlight" button to highlight the text in yellow.',
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
              YellowHighlightFeature,
            ],
          }),
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          localized: true,
          label: {
            uk: 'Опис',
            en: 'Description',
          },
          admin: {
            description: {
              uk: 'Описовий текст. Виділіть текст та використайте кнопку "Жовте виділення" для виділення частини тексту жовтим кольором.',
              en: 'Descriptive text. Select text and use the "Yellow highlight" button to highlight the text in yellow.',
            },
          },
          editor: lexicalEditor({
            features: [
              ParagraphFeature(),
              BoldFeature(),
              ItalicFeature(),
              InlineToolbarFeature(),
              IndentFeature(),
              YellowHighlightFeature,
            ],
          }),
        },
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
          name: 'developments',
          type: 'array',
          label: {
            uk: 'Розробки',
            en: 'Developments',
          },
          labels: {
            singular: {
              uk: 'Розробка',
              en: 'Development',
            },
            plural: {
              uk: 'Розробки',
              en: 'Developments',
            },
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: {
                uk: 'Зображення',
                en: 'Image',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'captions',
                  type: 'array',
                  label: {
                    uk: 'Підпис',
                    en: 'Caption',
                  },
                  labels: {
                    singular: {
                      uk: 'Підпис',
                      en: 'Caption',
                    },
                    plural: {
                      uk: 'Підписи',
                      en: 'Captions',
                    },
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'text',
                          type: 'text',
                          label: {
                            uk: 'Текст',
                            en: 'Text',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}
