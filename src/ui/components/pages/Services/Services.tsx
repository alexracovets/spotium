'use client'

import { Page } from '@payload-types'
import { CustomScroll, Wrapper, Text } from '@atoms'

type ServicesProps = {
  data: Page
}

export const Services = ({ data }: ServicesProps) => {
  if (!data.services_type_fields) return null

  const { title, services } = data.services_type_fields

  return (
    <CustomScroll className="h-full">
      <Wrapper variant="main_page_wrapper">
        <Wrapper variant="main_page_content">
          <Text variant="header_pages">{title}</Text>
        </Wrapper>
      </Wrapper>
    </CustomScroll>
  )
}
