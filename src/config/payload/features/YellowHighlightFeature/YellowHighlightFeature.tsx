import { TextStateFeature } from '@payloadcms/richtext-lexical'

export const YellowHighlightFeature = TextStateFeature({
  state: {
    highlight: {
      yellow: {
        label: 'Yellow highlight',
        css: {
          color: '#FEC532',
        },
      },
    },
  },
})
