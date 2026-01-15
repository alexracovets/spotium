'use client'

import { Page } from '@payload-types'
import { useState } from 'react'

import { CustomScroll, Wrapper, Text, Container, Button } from '@atoms'
import { AcordionServices } from '@molecules'

import { useGetServicesMedia, useModelsWrapperDimensions, useSwitchModel } from '@hooks'

type ServicesProps = {
  data: Page
}

export const Services = ({ data }: ServicesProps) => {
  const [openItemId, setOpenItemId] = useState<string | null>(null)
  useModelsWrapperDimensions()
  useSwitchModel({ newModel: 2 })

  useGetServicesMedia({
    items: data.services_type_fields?.services?.map((service) => service.media) || [],
  })

  if (!data.services_type_fields) return null

  const { services, button } = data.services_type_fields

  return (
    <Container>
      <Wrapper className="grid grid-cols-2 gap-x-[16px] h-full col-start-2 py-[64px]">
        <Wrapper variant="page_wrapper" className="min-h-0 w-full gap-y-[16px]">
          <Text variant="primary_heading">{data.title}</Text>
          <CustomScroll
            scrollToElementId={openItemId}
            setScrollToElementId={setOpenItemId}
            className="content_wrapper_mask"
          >
            <div className="flex flex-col justify-center items-start min-h-fit h-full">
              {services && <AcordionServices items={services} onOpenChange={setOpenItemId} />}
            </div>
          </CustomScroll>
          {button && (
            <Button size="normal" arrow className="mx-auto">
              {button}
            </Button>
          )}
        </Wrapper>
        <Wrapper variant="page_wrapper" id="models_wrapper" className="scale-[0.8]" />
      </Wrapper>
    </Container>
  )
}
