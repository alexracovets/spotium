import type { GlobalConfig } from 'payload'

export const Localization: GlobalConfig = {
  slug: 'localization-app',
  label: {
    uk: 'Локалізація',
    en: 'Localization',
  },
  admin: {
    description: {
      uk: 'Налаштування локалізації та зображень для кожної мови',
      en: 'Localization settings and images for each language',
    },
  },
  fields: [
    {
      name: 'lacales',
      type: 'array',
      label: {
        uk: 'Локалізації',
        en: 'Localizations',
      },
      labels: {
        singular: {
          uk: 'Локалізація',
          en: 'Localization',
        },
        plural: {
          uk: 'Локалізації',
          en: 'Localizations',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              type: 'text',
              name: 'name',
              label: {
                uk: "Ім'я локалі",
                en: 'Locale Name',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: {
                uk: 'Зображення локалі',
                en: 'Locale Image',
              },
            },
          ],
        },
      ],
    },
  ],
}
