import { type Field } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  InlineToolbarFeature,
  ParagraphFeature,
  ItalicFeature,
  IndentFeature,
  BoldFeature,
} from '@payloadcms/richtext-lexical'

import { YellowHighlightFeature } from '@features'

export const AboutPageFields = (): Field[] => {
  return [
    {
      type: 'group',
      name: 'about_type_fields',
      label: 'Поля для сторінки про нас',
      admin: {
        condition: (data) => data.type === 'about',
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
          name: 'subtitle',
          type: 'text',
          required: true,
          localized: true,
          label: {
            uk: 'Підзаголовок Опису',
            en: 'Subtitle Description',
          },
          admin: {
            description: {
              uk: 'Підзаголовок опису.',
              en: 'Subtitle description.',
            },
          },
        },
        {
          name: 'description',
          type: 'richText',
          required: true,
          localized: true,
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
              required: true,
              label: {
                uk: 'Зображення',
                en: 'Image',
              },
            },
            {
              name: 'name',
              type: 'text',
              required: true, 
              label: {
                uk: 'Назва',
                en: 'Name',
              },
            },
          ],
        },
      ],
    },
  ]
}
