import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { type Field } from 'payload'

import {
  InlineToolbarFeature,
  UnorderedListFeature,
  ParagraphFeature,
  IndentFeature,
  LinkFeature,
} from '@payloadcms/richtext-lexical'

import { YellowHighlightFeature } from '@features'

export const QAPageFields = (): Field[] => {
  return [
    {
      type: 'group',
      name: 'q_a_type_fields',
      label: 'Поля для сторінки Q&A',
      admin: {
        condition: (data) => data.type === 'q_a',
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
          ],
        },
        {
          name: 'questions',
          type: 'array',
          label: {
            uk: 'Питання та відповіді',
            en: 'Questions and answers',
          },
          labels: {
            singular: {
              uk: 'Питання',
              en: 'Question',
            },
            plural: {
              uk: 'Питання',
              en: 'Questions',
            },
          },
          fields: [
            {
              name: 'question',
              required: true,
              localized: true,
              type: 'richText',
              editor: lexicalEditor({
                features: [
                  ParagraphFeature(),
                  InlineToolbarFeature(),
                  IndentFeature(),
                  YellowHighlightFeature,
                ],
              }),
            },
            {
              name: 'answer',
              required: true,
              localized: true,
              type: 'richText',
              editor: lexicalEditor({
                features: [
                  ParagraphFeature(),
                  UnorderedListFeature(),
                  InlineToolbarFeature(),
                  IndentFeature(),
                  LinkFeature(),
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
