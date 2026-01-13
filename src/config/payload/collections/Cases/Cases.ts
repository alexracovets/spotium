import type { CollectionConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  UnorderedListFeature,
  ParagraphFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'

import { YellowHighlightFeature } from '@features'

export const Cases: CollectionConfig = {
  slug: 'cases',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data.parent) {
          const parentPage = await req.payload.findByID({
            collection: 'pages',
            id: data.parent,
          })
          data.slug = `${parentPage.slug}/${data.slug_name}`
        } else {
          data.slug = `${data.slug_name}`
        }
        return data
      },
    ],
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
                  uk: 'Назва кейсу',
                  en: 'Case name',
                },
              },
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
                  uk: 'Опис кейсу',
                  en: 'Case description',
                },
              },
              editor: lexicalEditor({
                features: [ParagraphFeature(), InlineToolbarFeature(), YellowHighlightFeature],
              }),
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: {
                uk: 'Зображення',
                en: 'Image',
              },
              admin: {
                description: {
                  uk: 'Зображення кейсу',
                  en: 'Case image',
                },
              },
            },
            {
              name: 'tags',
              type: 'array',
              required: true,
              label: {
                uk: 'Теги',
                en: 'Tags',
              },
              labels: {
                singular: {
                  uk: 'Тег',
                  en: 'Tag',
                },
                plural: {
                  uk: 'Теги',
                  en: 'Tags',
                },
              },
              admin: {
                description: {
                  uk: 'Теги кейсу',
                  en: 'Case tags',
                },
              },
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  required: true,
                  label: {
                    uk: 'Назва тегу',
                    en: 'Tag name',
                  },
                  admin: {
                    description: {
                      uk: 'Назва тегу кейсу',
                      en: 'Case tag name',
                    },
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'show_button',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: {
                    uk: 'Текст кнопки для показу кейсу',
                    en: 'Button text for showing the case',
                  },
                },
                {
                  name: 'form_button',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: {
                    uk: 'Текст кнопки для форми',
                    en: 'Button text for form',
                  },
                },
              ],
            },
            {
              name: 'impuct',
              type: 'richText',
              required: true,
              localized: true,
              label: {
                uk: 'Інформація про кейс',
                en: 'Case information',
              },
              admin: {
                description: {
                  uk: 'Інформація про кейс',
                  en: 'Case information',
                },
              },
              editor: lexicalEditor({
                features: [
                  ParagraphFeature(),
                  UnorderedListFeature(),
                  InlineToolbarFeature(),
                  YellowHighlightFeature,
                ],
              }),
            },
            {
              name: 'features',
              type: 'array',
              label: {
                uk: 'Особливості кейсу',
                en: 'Case features',
              },
              labels: {
                singular: {
                  uk: 'Особливість',
                  en: 'Feature',
                },
                plural: {
                  uk: 'Особливості',
                  en: 'Features',
                },
              },
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
                      uk: 'Заголовок особливості кейсу',
                      en: 'Case feature title',
                    },
                  },
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
                      uk: 'Опис особливості кейсу',
                      en: 'Case feature description',
                    },
                  },
                  editor: lexicalEditor({
                    features: [
                      ParagraphFeature(),
                      UnorderedListFeature(),
                      InlineToolbarFeature(),
                      YellowHighlightFeature,
                    ],
                  }),
                },
              ],
            },
            {
              name: 'tabs',
              type: 'group',
              label: {
                uk: 'Блок табів',
                en: 'Tabs block',
              },
              fields: [
                {
                  type: 'tabs',
                  tabs: [
                    {
                      label: {
                        uk: 'Блок інформації команди',
                        en: 'Team information block',
                      },
                      description: {
                        uk: 'Опис блоку інформації команди',
                        en: 'Team information block description',
                      },
                      fields: [
                        {
                          name: 'info_tab',
                          type: 'group',
                          label: {
                            uk: 'Блок інформації команди',
                            en: 'Team information block',
                          },
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
                                  uk: 'Заголовок табу',
                                  en: 'Tab title',
                                },
                              },
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
                              editor: lexicalEditor({
                                features: [
                                  ParagraphFeature(),
                                  UnorderedListFeature(),
                                  InlineToolbarFeature(),
                                  YellowHighlightFeature,
                                ],
                              }),
                            },
                          ],
                        },
                      ],
                    },
                    {
                      label: {
                        uk: 'Q&A',
                        en: 'Q&A',
                      },
                      description: {
                        uk: 'Блок питань та відповідей',
                        en: 'Questions and answers block',
                      },
                      fields: [
                        {
                          name: 'qa_tab',
                          type: 'group',
                          label: {
                            uk: 'Блок питань та відповідей',
                            en: 'Questions and answers block',
                          },
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
                                  uk: 'Заголовок блоку питань та відповідей',
                                  en: 'Questions and answers block title',
                                },
                              },
                            },
                            {
                              name: 'elements',
                              type: 'array',
                              label: {
                                uk: 'Питання та відповіді',
                                en: 'Questions and answers',
                              },
                              labels: {
                                singular: {
                                  uk: 'Елемент',
                                  en: 'Element',
                                },
                                plural: {
                                  uk: 'Елементи',
                                  en: 'Elements',
                                },
                              },
                              fields: [
                                {
                                  name: 'question',
                                  type: 'text',
                                  required: true,
                                  localized: true,
                                  label: {
                                    uk: 'Питання',
                                    en: 'Question',
                                  },
                                  admin: {
                                    description: {
                                      uk: 'Питання стосовно кейсу',
                                      en: 'Question about the case',
                                    },
                                  },
                                },
                                {
                                  name: 'answer',
                                  type: 'richText',
                                  required: true,
                                  localized: true,
                                  label: {
                                    uk: 'Відповідь',
                                    en: 'Answer',
                                  },
                                  admin: {
                                    description: {
                                      uk: 'Відповідь на питання стосовно кейсу',
                                      en: 'Answer to the question about the case',
                                    },
                                  },
                                  editor: lexicalEditor({
                                    features: [
                                      ParagraphFeature(),
                                      UnorderedListFeature(),
                                      InlineToolbarFeature(),
                                      YellowHighlightFeature,
                                    ],
                                  }),
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
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
              name: 'slug_name',
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
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              admin: {
                hidden: true,
              },
            },
            {
              name: 'parent',
              label: 'Батьківська сторінка',
              type: 'relationship',
              relationTo: 'pages',
              hasMany: false,
            },
          ],
        },
      ],
    },
  ],
}
