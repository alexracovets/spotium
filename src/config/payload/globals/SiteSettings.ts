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
  ],
}
