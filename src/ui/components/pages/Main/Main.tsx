'use client'

import { Page } from '@payload-types'

import { Developments, RichTextRender } from '@molecules'

import { useModelsWrapperDimensions, useSwitchModel } from '@hooks'
import { Button, Container, CustomScroll, Wrapper } from '@atoms'

type MainProps = {
  data: Page
}

export const Main = ({ data }: MainProps) => {
  useModelsWrapperDimensions()
  useSwitchModel({ newModel: 0 })

  if (!data.main_type_fields) return null

  const { description, button, developments, title_main } = data.main_type_fields

  return (
    <Wrapper variant="main_wrapper">
      <Wrapper variant="page_wrapper" className="min-h-0 h-full items-start justify-center">
        <CustomScroll className="h-full">
          <Container>
            <Wrapper className="flex flex-col justify-center h-full items-start gap-y-[32px] min-h-fit py-[32px]">
              {title_main && (
                <Wrapper>
                  <RichTextRender text={title_main} variant="main" />
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
          </Container>
        </CustomScroll>
      </Wrapper>
      <Wrapper variant="page_wrapper" id="models_wrapper" />
    </Wrapper>
  )
}
