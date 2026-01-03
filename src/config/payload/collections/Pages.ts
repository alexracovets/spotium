import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { YellowHighlightFeature } from '@features'
import {
  InlineToolbarFeature,
  ParagraphFeature,
  HeadingFeature,
  ItalicFeature,
  IndentFeature,
  BoldFeature,
} from '@payloadcms/richtext-lexical'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'updatedAt'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            uk: 'Контент',
            en: 'Content',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: false,
              localized: true,
              label: {
                uk: 'Назва',
                en: 'Name',
              },
              admin: {
                description: {
                  uk: 'Назва сторінки',
                  en: 'Page name',
                },
              },
            },
            {
              name: 'title',
              type: 'richText',
              required: true,
              localized: true,
              label: {
                uk: 'Заголовок',
                en: 'Title',
              },
              admin: {
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
          ],
        },
        {
          label: {
            uk: 'Конфігурація',
            en: 'Configuration',
          },
          fields: [
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              label: {
                uk: 'URL-адреса',
                en: 'URL address',
              },
              admin: {
                description: {
                  uk: 'Унікальна URL-адреса сторінки (наприклад: "home")',
                  en: 'Unique URL address of the page (e.g. "home")',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
