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
      name: 'animatedTexts',
      type: 'array',
      label: {
        uk: 'Анімовані тексти',
        en: 'Animated Texts',
      },
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
          label: {
            uk: 'Перше слово',
            en: 'First Word',
          },
        },
        {
          name: 'secondWord',
          type: 'text',
          label: {
            uk: 'Друге слово',
            en: 'Second Word',
          },
        },
      ],
    },
  ],
}
