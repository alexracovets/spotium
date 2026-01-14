'use client'

import { Page } from '@payload-types'

import { CustomScroll, Wrapper, Text, Container } from '@atoms'
import { Questions } from '@molecules'

import { useModelsWrapperDimensions } from '@hooks'

export const QAPage = ({ data }: { data: Page }) => {
  useModelsWrapperDimensions()

  if (!data.q_a_type_fields) return null
  const { title, questions } = data.q_a_type_fields

  return (
    <CustomScroll>
      <Container>
        <Wrapper variant="page_wrapper" className="min-h-0 w-full py-[64px] gap-y-[16px]">
          <Text variant="primary_heading" asChild>
            <h1>{title}</h1>
          </Text>
          {questions && <Questions items={questions} />}
        </Wrapper>
      </Container>
    </CustomScroll>
  )
}
