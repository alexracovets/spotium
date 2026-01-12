'use client'

import { Page } from '@payload-types'
import { useState } from 'react'

import { CustomScroll, Wrapper, Text, Container, Button } from '@atoms'
import { AcordionServices } from '@molecules'

import { useGetServicesMedia, useModelsWrapperDimensions } from '@hooks'

type ServicesProps = {
  data: Page
}

export const Services = ({ data }: ServicesProps) => {
  const [openItemId, setOpenItemId] = useState<string | null>(null)

  // Всі хуки повинні викликатися перед умовними поверненнями
  useModelsWrapperDimensions()
  useGetServicesMedia({
    items: data.services_type_fields?.services?.map((service) => service.media) || [],
  })

  if (!data.services_type_fields) return null

  const { title, services, button } = data.services_type_fields

  return (
    <Container>
      <Wrapper className="grid grid-cols-2 gap-x-[16px] h-full col-start-2 py-[64px]">
        <Wrapper variant="page_wrapper" className="min-h-0 w-full gap-y-[16px]">
          <Text variant="primary_heading">{title}</Text>
          <CustomScroll
            scrollToElementId={openItemId}
            setScrollToElementId={setOpenItemId}
            className="content_wrapper_mask"
          >
            {services && <AcordionServices items={services} onOpenChange={setOpenItemId} />}
          </CustomScroll>
          {button && (
            <Button size="normal" arrow className="mx-auto">
              {button}
            </Button>
          )}
        </Wrapper>
        <Wrapper variant="page_wrapper" id="models_wrapper" />
      </Wrapper>
    </Container>
  )
}
