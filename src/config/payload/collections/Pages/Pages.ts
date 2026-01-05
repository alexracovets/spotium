import type { CollectionConfig } from 'payload'

import { MainPageFields, ServicesPageFields } from '@fields'

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
              name: 'type',
              type: 'select',
              label: {
                uk: 'Тип сторінки',
                en: 'Page type',
              },
              options: [
                {
                  label: {
                    uk: 'Основна',
                    en: 'Main',
                  },
                  value: 'main',
                },
                {
                  label: {
                    uk: 'Сервіси',
                    en: 'Services',
                  },
                  value: 'services',
                },
              ],
              defaultValue: 'main',
              admin: {
                width: '50%',
              },
            },
            ...MainPageFields(),
            ...ServicesPageFields(),
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
