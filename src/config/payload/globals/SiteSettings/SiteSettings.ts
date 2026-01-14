import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: {
    uk: 'Налаштування сайту',
    en: 'Site Settings',
  },
  admin: {
    description: {
      uk: 'Глобальні налаштування сайту',
      en: 'Global site settings',
    },
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: {
        uk: 'Логотип сайту',
        en: 'Site Logo',
      },
      admin: {
        description: {
          uk: 'Основне логотип сайту',
          en: 'Main site logo',
        },
      },
    },
    {
      name: 'navigation',
      type: 'relationship',
      relationTo: 'pages',
      label: {
        uk: 'Навігація',
        en: 'Navigation',
      },
      localized: true,
      hasMany: true,
      admin: {
        description: {
          uk: 'Навігація сайту',
          en: 'Site navigation',
        },
      },
    },
    {
      name: 'animatedTexts',
      type: 'array',
      label: {
        uk: 'Анімовані тексти',
        en: 'Animated Texts',
      },
      localized: true,
      admin: {
        description: {
          uk: 'Список текстів для анімації. Кожен елемент складається з двох слів',
          en: 'List of texts for animation. Each element consists of two words',
        },
      },
      fields: [
        {
          name: 'firstWord',
          type: 'text',
          localized: true,
          label: {
            uk: 'Перше слово',
            en: 'First Word',
          },
        },
        {
          name: 'secondWord',
          type: 'text',
          localized: true,
          label: {
            uk: 'Друге слово',
            en: 'Second Word',
          },
        },
      ],
    },
    {
      name: 'footer',
      type: 'text',
      localized: true,
      label: {
        uk: 'Текст в футері',
        en: 'Footer Text',
      },
      admin: {
        description: {
          uk: 'Текст в футері, який буде виведений в правій частині',
          en: 'Footer Text in the right part',
        },
      },
    },
  ],
}
