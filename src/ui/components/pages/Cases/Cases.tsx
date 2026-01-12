'use client'

import { Page } from '@payload-types'

import { Wrapper, Text, Container } from '@atoms'
import { CasesBlock } from '@molecules'

import { useModelsWrapperDimensions } from '@hooks'

type CasesProps = {
  data: Page
}

export const Cases = ({ data }: CasesProps) => {
  useModelsWrapperDimensions()

  if (!data.cases_type_fields) return null

  const { title, elements } = data.cases_type_fields

  return (
    <Container>
      <Wrapper variant="page_wrapper" className="min-h-0 w-full py-[64px] gap-y-[16px]">
        <Text variant="primary_heading">{title}</Text>
        {elements && <CasesBlock items={elements} />}
      </Wrapper>
    </Container>
  )
}
