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
    <CustomScroll className="h-full">
      <Container>
        <Wrapper className="grid grid-cols-2 gap-x-[16px] h-full col-start-2 py-[64px]">
          <Wrapper
            variant="page_wrapper"
            className="min-h-0 h-full py-[64px] items-start justify-center"
          >
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
          <div className="relative overflow-hidden">
            <Wrapper
              variant="page_wrapper"
              id="models_wrapper"
              className="scale-[1.3] absolute top-0 left-0 w-full h-full"
            />
          </div>
        </Wrapper>
      </Container>
    </CustomScroll>
  )
}
