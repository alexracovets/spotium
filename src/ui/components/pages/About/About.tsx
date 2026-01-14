'use client'

import { Media, Page } from '@payload-types'

import { Wrapper, Text, Container, CustomScroll, ImageAtom } from '@atoms'
import { RichTextRender } from '@molecules'

import { useModelsWrapperDimensions } from '@hooks'
import { cn } from '@utils'

type AboutProps = {
  data: Page
}

export const About = ({ data }: AboutProps) => {
  useModelsWrapperDimensions()

  if (!data.about_type_fields) return null

  const { title, subtitle, description, developments } = data.about_type_fields
  const developmentCount = developments?.length ?? 0
  const itemsPerRow = 3
  const lastRowStartIndex = developmentCount - (developmentCount % itemsPerRow || itemsPerRow)

  return (
    <CustomScroll>
      <Container>
        <Wrapper className="grid grid-cols-2 gap-x-[16px] h-full col-start-2 py-[64px]">
          <Wrapper className="grid grid-rows-[auto_1fr]">
            <Text variant="primary_heading" asChild>
              <h1>{title}</h1>
            </Text>
            <Wrapper variant="page_wrapper" id="models_wrapper" />
          </Wrapper>
          <Wrapper variant="page_wrapper" className="gap-y-[16px] justify-center">
            <Wrapper className="flex flex-col gap-y-[24px] bg-bg-content rounded-[8px] p-[16px]">
              <Text className="text-[32px] leading-[1]">{subtitle}</Text>
              <Wrapper className="flex flex-col gap-y-[12px]">
                <RichTextRender text={description} variant="primary" />
              </Wrapper>
            </Wrapper>
            <Wrapper className="flex flex-col gap-y-[24px] bg-bg-content rounded-[8px] px-[16px]">
              <div className="grid grid-cols-3">
                {developments?.map((development, idx) => {
                  const isLastRow = idx >= lastRowStartIndex
                  return (
                    <Wrapper
                      key={idx}
                      className={cn(
                        'flex justify-start items-center gap-x-[16px] py-[16px]',
                        !isLastRow && 'border-b border-border-destructive',
                      )}
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
              </div>
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </Container>
    </CustomScroll>
  )
}
