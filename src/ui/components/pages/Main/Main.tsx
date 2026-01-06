'use client'

import { Developments, RichTextRender } from '@molecules'
import { MdArrowOutward } from 'react-icons/md'

import { Page } from '@payload-types'
import { Button, Container, CustomScroll, Wrapper } from '@atoms'

type MainProps = {
  data: Page
}

export const Main = ({ data }: MainProps) => {
  if (!data.main_type_fields) return null

  const { title, description, button, developments } = data.main_type_fields

  return (
    <CustomScroll className="h-full">
      <Container asChild>
        <Wrapper variant="main_page_wrapper" className="min-h-0 h-full py-[64px]">
          <Wrapper variant="page_content">
            {title && (
              <Wrapper>
                <RichTextRender text={title} variant="header_1" />
              </Wrapper>
            )}
            {description && (
              <Wrapper>
                <RichTextRender text={description} variant="header_2" />
              </Wrapper>
            )}
            {button && (
              <Button size="normal">
                <p>
                  <span>{button}</span>
                  <MdArrowOutward />
                </p>
              </Button>
            )}
            {developments && <Developments developments={developments} />}
          </Wrapper>
        </Wrapper>
      </Container>
    </CustomScroll>
  )
}
