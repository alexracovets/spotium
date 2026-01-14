'use client'

import { Page } from '@payload-types'

import { Wrapper, Text, Container, CustomScroll } from '@atoms'
import { CasesBlock } from '@molecules'

import { useModelsWrapperDimensions, useSwitchModel } from '@hooks'

type CasesProps = {
  data: Page
}

export const Cases = ({ data }: CasesProps) => {
  useModelsWrapperDimensions()
  useSwitchModel({ newModel: -1 })

  if (!data.cases_type_fields) return null

  const { elements } = data.cases_type_fields

  return (
    <CustomScroll>
      <Container>
        <Wrapper variant="page_wrapper" className="min-h-0 w-full py-[64px] gap-y-[16px]">
          <Text variant="primary_heading" asChild>
            <h1>{data.title}</h1>
          </Text>
          {elements && <CasesBlock items={elements} />}
        </Wrapper>
      </Container>
    </CustomScroll>
  )
}
