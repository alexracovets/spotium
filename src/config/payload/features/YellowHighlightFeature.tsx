import { TextStateFeature } from '@payloadcms/richtext-lexical'

export const YellowHighlightFeature = TextStateFeature({
  state: {
    highlight: {
      yellow: {
        label: 'Жовте виділення',
        css: {
          color: '#FEC532',
        },
      },
    },
  },
})
