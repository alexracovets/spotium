'use client'

import { Page } from '@payload-types'

import { CustomScroll, Wrapper, Text, Container } from '@atoms'
import { AcordionBlock } from '@molecules'

type ServicesProps = {
  data: Page
}

export const Services = ({ data }: ServicesProps) => {
  if (!data.services_type_fields) return null

  const { title, services } = data.services_type_fields

  return (
    <CustomScroll className="h-full">
      <Container>
        <Wrapper className="grid grid-cols-2 gap-x-[16px] h-full col-start-2 py-[64px]">
          <Wrapper variant="page_wrapper">
            <Text variant="header_pages">{title}</Text>
            {services && <AcordionBlock items={services} />}
          </Wrapper>
          <Wrapper variant="page_wrapper" id="models_wrapper" />
        </Wrapper>
      </Container>
    </CustomScroll>
  )
}
