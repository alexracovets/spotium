'use client'

import { useEffect, useState } from 'react'
import { Media, Page } from '@payload-types'

import { CustomScroll, Wrapper, Text, Container, Button } from '@atoms'
import { AcordionBlock } from '@molecules'

import { useGetServicesMedia, useModelsWrapperDimensions } from '@hooks'

type ServicesProps = {
  data: Page
}

export const Services = ({ data }: ServicesProps) => {
  const [openItemId, setOpenItemId] = useState<string | null>(null)

  if (!data.services_type_fields) return null

  const { title, services, button } = data.services_type_fields

  useModelsWrapperDimensions()
  useGetServicesMedia({ items: services?.map((service) => service.media) || [] })

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
            {services && <AcordionBlock items={services} onOpenChange={setOpenItemId} />}
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
