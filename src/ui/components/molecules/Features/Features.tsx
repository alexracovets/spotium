'use client'

import { Case } from '@payload-types'

import { RichTextRender } from '@molecules'
import { Wrapper, Text, Separator } from '@atoms'

type FeaturesProps = {
  features: NonNullable<NonNullable<Case['features']>>
}

export const Features = ({ features }: FeaturesProps) => {
  return (
    <Wrapper asChild>
      <section>
        {features.map((feature) => (
          <Wrapper key={feature.id}>
            <Text variant="feature_title">{feature.title}</Text>
            <Separator />
            <Wrapper variant="rich_text_wrapper">
              <RichTextRender text={feature.description} variant="primary" />
            </Wrapper>
          </Wrapper>
        ))}
      </section>
    </Wrapper>
  )
}
