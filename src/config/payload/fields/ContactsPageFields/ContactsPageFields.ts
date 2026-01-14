import { type Field } from 'payload'

export const ContactsPageFields = (): Field[] => {
  return [
    {
      type: 'group',
      name: 'contacts_type_fields',
      label: 'Поля для сторінки контактів',
      admin: {
        condition: (data) => data.type === 'contacts',
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
            {
              name: 'under_title',
              type: 'text',
              required: true,
              localized: true,
              label: {
                uk: 'Надзаголовок',
                en: 'Under title',
              },
              admin: {
                description: {
                  uk: 'Надзаголовок сторінки.',
                  en: 'Under page title.',
                },
                width: '50%',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'email',
              type: 'text',
              required: true,
              localized: true,
              label: {
                uk: 'Email',
                en: 'Email',
              },
              admin: {
                description: {
                  uk: "Email для зворотнього зв'язку.",
                  en: 'Email for feedback.',
                },
                width: '50%',
              },
            },
            {
              name: 'email_copy',
              type: 'text',
              required: true,
              localized: true,
              label: {
                uk: 'Текст копіювання email',
                en: 'Email copy text',
              },
              admin: {
                description: {
                  uk: 'Текст копіївання email.',
                  en: 'Text to copy email.',
                },
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'work_time',
          type: 'array',
          label: {
            uk: 'Робочий час',
            en: 'Work time',
          },
          labels: {
            singular: {
              uk: 'Робочий час',
              en: 'Work time',
            },
            plural: {
              uk: 'Робочі часи',
              en: 'Work times',
            },
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              localized: true,
              label: {
                uk: 'Назва',
                en: 'Name',
              },
            },
            {
              name: 'time',
              type: 'text',
              required: true,
              localized: true,
              label: {
                uk: 'Час',
                en: 'Time',
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'phone_name',
              type: 'text',
              required: true,
              localized: true,
              label: {
                uk: 'Поле для тексту телефону',
                en: 'Phone text',
              },
              admin: {
                width: '50%',
              },
            },
            {
              name: 'phone_value',
              type: 'text',
              required: true,
              localized: true,
              label: {
                uk: 'Телефон для дзвінка',
                en: 'Phone for call',
              },
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'socials',
          type: 'array',
          label: {
            uk: 'Соціальні мережі',
            en: 'Socials',
          },
          labels: {
            singular: {
              uk: 'Соціальна мережа',
              en: 'Social network',
            },
            plural: {
              uk: 'Соціальні мережі',
              en: 'Social networks',
            },
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: {
                    uk: 'Назва',
                    en: 'Name',
                  },
                },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                  label: {
                    uk: 'Посилання',
                    en: 'Link',
                  },
                },
              ],
            },
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: {
                uk: 'Іконка',
                en: 'Icon',
              },
            },
          ],
        },
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
  ]
}
