'use client'

import { Page } from '@payload-types'

import { CustomScroll, Wrapper, Text, Container, Button } from '@atoms'
import { AcordionBlock } from '@molecules'
import { useModelsWrapperDimensions } from '@hooks'
import { useState } from 'react'
import { MdArrowOutward } from 'react-icons/md'

type ServicesProps = {
  data: Page
}

export const Services = ({ data }: ServicesProps) => {
  const [isTrigger, setIsTrigger] = useState<boolean>(false)
  useModelsWrapperDimensions()

  if (!data.services_type_fields) return null

  const { title, services, button } = data.services_type_fields

  return (
    <Container>
      <Wrapper className="grid grid-cols-2 gap-x-[16px] h-full col-start-2 py-[64px]">
        <Wrapper variant="page_wrapper" className="min-h-0 h-full w-full gap-y-[16px]">
          <Text variant="primary_heading">{title}</Text>
          <CustomScroll isTrigger={isTrigger} setIsTrigger={setIsTrigger}>
            {services && <AcordionBlock items={services} setIsTrigger={setIsTrigger} />}
          </CustomScroll>
          {button && (
            <Button size="normal" arrow>
              {button}
            </Button>
          )}
        </Wrapper>
        <Wrapper variant="page_wrapper" id="models_wrapper" />
      </Wrapper>
    </Container>
  )
}
