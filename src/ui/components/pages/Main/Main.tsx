'use client'

import { Page } from '@payload-types'

import { Developments, MainTitle, MainDescription, AboutMobile } from '@molecules'
import { Button, Container, CustomScroll, Wrapper } from '@atoms'

import { useMobile, useModelsWrapperDimensions, useSwitchModel } from '@hooks'

import { SupportedLocaleType } from '@types'
type MainProps = {
  data: Page
  locale: SupportedLocaleType['name']
}

export const Main = ({ data, locale }: MainProps) => {
  useModelsWrapperDimensions()
  useSwitchModel({ newModel: 0 })
  const isMobile = useMobile()

  if (!data.main_type_fields) return null

  const { description, button, developments, title_main } = data.main_type_fields

  return (
    <Wrapper variant="page">
      {isMobile === false && <Wrapper variant="main_models" id="models_wrapper" />}
      <CustomScroll>
        <Container asChild>
          <Wrapper variant="main_page">
            <Wrapper variant="main_content">
              {isMobile === true && <Wrapper variant="main_models" id="models_wrapper" />}
              <MainTitle title_main={title_main} />
              <MainDescription description={description} />
              <Button size="normal" arrow className="max-sm:order-3">
                {button}
              </Button>
              <Developments developments={developments} />
            </Wrapper>
            {isMobile === true && <AboutMobile locale={locale} />}
          </Wrapper>
        </Container>
      </CustomScroll>
    </Wrapper>
  )
}
