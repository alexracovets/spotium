import { type Field } from 'payload'

export const CasesPageFields = (): Field[] => {
  return [
    {
      type: 'group',
      name: 'cases_type_fields',
      label: 'Поля для сторінки кейсів',
      admin: {
        condition: (data) => data.type === 'cases',
      },
      fields: [
        {
          name: 'elements',
          label: {
            uk: 'Відображати Кейси',
            en: 'Display Cases',
          },
          type: 'relationship',
          relationTo: 'cases',
          hasMany: true,
        },
      ],
    },
  ]
}
