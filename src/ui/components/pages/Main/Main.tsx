'use client'

import { Developments, RichTextRender } from '@molecules'
import { MdArrowOutward } from 'react-icons/md'

import { Page } from '@payload-types'
import { Button, Container, CustomScroll, Wrapper } from '@atoms'
import { useModelsWrapperDimensions } from '@hooks'

type MainProps = {
  data: Page
}

export const Main = ({ data }: MainProps) => {
  useModelsWrapperDimensions()

  if (!data.main_type_fields) return null

  const { title, description, button, developments } = data.main_type_fields

  return (
    <CustomScroll className="h-full">
      <Container>
        <Wrapper className="grid grid-cols-2 gap-x-[16px] h-full col-start-2 py-[64px]">
          <Wrapper variant="page_wrapper" className="min-h-0 h-full py-[64px] items-start">
            {title && (
              <Wrapper>
                <RichTextRender text={title} variant="main" />
              </Wrapper>
            )}
            {description && (
              <Wrapper>
                <RichTextRender text={description} variant="main" />
              </Wrapper>
            )}
            {button && (
              <Button size="normal" arrow>
                {button}
              </Button>
            )}
            {developments && <Developments developments={developments} />}
          </Wrapper>
          <Wrapper variant="page_wrapper" id="models_wrapper" />
        </Wrapper>
      </Container>
    </CustomScroll>
  )
}
