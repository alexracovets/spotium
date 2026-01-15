'use client'

import { Page } from '@payload-types'

import { Developments, MainTitle, MainDescription } from '@molecules'

import { useMobile, useModelsWrapperDimensions, useSwitchModel } from '@hooks'
import { Button, Container, CustomScroll, Wrapper } from '@atoms'

type MainProps = {
  data: Page
}

export const Main = ({ data }: MainProps) => {
  useModelsWrapperDimensions()
  useSwitchModel({ newModel: 0 })
  const isMobile = useMobile()

  if (!data.main_type_fields) return null

  const { description, button, developments, title_main } = data.main_type_fields

  return (
    <Wrapper variant="main_wrapper">
      <Wrapper variant="page_wrapper">
        {isMobile === false && <Wrapper variant="main_models" id="models_wrapper" />}
        <CustomScroll>
          <Container>
            <Wrapper variant="main_content">
              {isMobile === true && <Wrapper variant="main_models" id="models_wrapper" />}
              <MainTitle title_main={title_main} />
              <MainDescription description={description} />
              <Button size="normal" arrow className="max-sm:order-3">
                {button}
              </Button>
              <Developments developments={developments} />
            </Wrapper>
          </Container>
        </CustomScroll>
      </Wrapper>
    </Wrapper>
  )
}
