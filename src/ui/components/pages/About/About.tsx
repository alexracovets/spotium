'use client'

import { Media, Page } from '@payload-types'

import { Wrapper, Text, Container, CustomScroll, ImageAtom } from '@atoms'
import { RichTextRender } from '@molecules'

import { useModelsWrapperDimensions, useSwitchModel } from '@hooks'
import { cn } from '@utils'

type AboutProps = {
  data: Page
}

export const About = ({ data }: AboutProps) => {
  useModelsWrapperDimensions()
  useSwitchModel({ newModel: 1 })

  if (!data.about_type_fields) return null

  const { subtitle, description, developments } = data.about_type_fields
  const developmentCount = developments?.length ?? 0
  const itemsPerRow = 3
  const lastRowStartIndex = developmentCount - (developmentCount % itemsPerRow || itemsPerRow)

  return (
    <Container>
      <Wrapper className="grid grid-cols-2 gap-x-[16px] h-full col-start-2 py-[64px]">
        <Wrapper className="grid grid-rows-[auto_1fr]">
          <Text variant="primary_heading" asChild>
            <h1>{data.title}</h1>
          </Text>
          <Wrapper variant="page_wrapper" id="models_wrapper" />
        </Wrapper>
        <CustomScroll>
          <Wrapper variant="about_content_wrapper">
            <Wrapper variant="about_content">
              <Text variant="about_content_title">{subtitle}</Text>
              <Wrapper variant="about_content_text">
                <RichTextRender text={description} variant="primary" />
              </Wrapper>
            </Wrapper>
            <Wrapper variant="about_content">
              <Wrapper variant="about_developments">
                {developments?.map((development, idx) => {
                  const isLastRow = idx >= lastRowStartIndex
                  return (
                    <Wrapper
                      key={idx}
                      variant="about_developments_item"
                      className={!isLastRow ? 'border-b border-border-destructive' : ''}
                    >
                      <ImageAtom
                        image={development.image as Media}
                        alt={development.name}
                        variant="development_about"
                      />
                      <Text className="text-[14px] leading-[1]">{development.name}</Text>
                    </Wrapper>
                  )
                })}
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </CustomScroll>
      </Wrapper>
    </Container>
  )
}
