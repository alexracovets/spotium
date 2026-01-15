'use client'

import { Page } from '@payload-types'

import { Developments, MainTitle, MainDescription } from '@molecules'

import { useModelsWrapperDimensions, useSwitchModel } from '@hooks'
import { Button, Container, CustomScroll, Wrapper } from '@atoms'
import { cn } from '@utils'

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
      <Wrapper variant="page_wrapper">
        <CustomScroll>
          <Container>
            <Wrapper variant="main_content">
              <MainTitle title_main={title_main} />
              <MainDescription description={description} />
              <Button size="normal" arrow>
                {button}
              </Button>
              <Developments developments={developments} />
            </Wrapper>
          </Container>
        </CustomScroll>
      </Wrapper>
      <Wrapper
        className={cn(
          'absolute top-0 right-0 w-full max-w-[900px] h-full',
          'max-[1500px]:max-w-[600px]',
          'max-[1350px]:max-w-[500px]',
        )}
        variant="page_wrapper"
        id="models_wrapper"
      />
    </Wrapper>
  )
}
