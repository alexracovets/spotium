'use client'

import { FaArrowLeftLong } from 'react-icons/fa6'
import { Case, Media } from '@payload-types'

import { Wrapper, Text, Container, VideoAtom, ImageAtom, Button, CustomScroll } from '@atoms'
import { RichTextRender, Features, CasesTabs } from '@molecules'

import { useModelsWrapperDimensions } from '@hooks'

type CaseItemProps = {
  data: Case
}

export const CaseItem = ({ data }: CaseItemProps) => {
  useModelsWrapperDimensions()
  const { name, impuct, image, form_button, features, tabs } = data

  const mimeType = typeof image === 'object' && image !== null ? image.mimeType : null
  const isVideo = mimeType?.startsWith('video') ?? false

  return (
    <CustomScroll>
      <Container>
        <Wrapper variant="page_wrapper" className="min-h-0 w-full py-[64px] gap-y-[32px] w-full">
          <Wrapper variant="case_grid" asChild>
            <section>
              <Wrapper variant="column" className="gap-y-[32px]">
                <Text variant="primary_heading" asChild>
                  <h1>{name}</h1>
                </Text>
                <Wrapper variant="column" className="gap-y-[4px]">
                  <RichTextRender text={impuct} variant="medium" />
                </Wrapper>
                <Wrapper className="flex justify-start items-start flex-wrap gap-[16px]">
                  <Button variant="link" size="normal">
                    <FaArrowLeftLong />
                  </Button>
                  <Button arrow size="normal">
                    {form_button}
                  </Button>
                </Wrapper>
              </Wrapper>
              {image && isVideo ? (
                <VideoAtom video={image as Media} autoPlay variant="cases" />
              ) : (
                image && (
                  <ImageAtom
                    image={image as Media}
                    alt={(image as Media)?.alt || name || ''}
                    variant="cases"
                  />
                )
              )}
            </section>
          </Wrapper>
          {features && <Features features={features} />}
          {tabs && <CasesTabs items={tabs} />}
        </Wrapper>
      </Container>
    </CustomScroll>
  )
}
