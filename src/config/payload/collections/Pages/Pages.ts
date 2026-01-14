import type { CollectionConfig } from 'payload'

import {
  ServicesPageFields,
  ContactsPageFields,
  CasesPageFields,
  AboutPageFields,
  MainPageFields,
  QAPageFields,
} from '@fields'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'name',
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
                {
                  label: {
                    uk: 'Кейси',
                    en: 'Cases',
                  },
                  value: 'cases',
                },
                {
                  label: {
                    uk: 'Про нас',
                    en: 'About',
                  },
                  value: 'about',
                },
                {
                  label: {
                    uk: 'Q&A',
                    en: 'Q&A',
                  },
                  value: 'q_a',
                },
                {
                  label: {
                    uk: 'Контакти',
                    en: 'Contacts',
                  },
                  value: 'contacts',
                },
              ],
              defaultValue: 'main',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'title',
              type: 'text',
              localized: true,
              label: {
                uk: 'Заголовок',
                en: 'Title',
              },
              admin: {
                condition: (data) => data.type !== 'main',
                description: {
                  uk: 'Основний заголовок сторінки.',
                  en: 'Main page title.',
                },
                width: '50%',
              },
            },
            ...MainPageFields(),
            ...ServicesPageFields(),
            ...CasesPageFields(),
            ...AboutPageFields(),
            ...QAPageFields(),
            ...ContactsPageFields(),
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
