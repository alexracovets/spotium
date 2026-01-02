'use client'

import { RichTextRender } from '@molecules'
import { MdArrowOutward } from 'react-icons/md'

import { Page } from '@payload-types'
import { Button, Container } from '@atoms'

type MainProps = {
  data: Page
}

export const Main = ({ data }: MainProps) => {
  return (
    <Container>
      <div className="flex flex-col justify-center items-start h-full min-h-0">
        <div className="flex flex-col justify-start items-start gap-y-[24px]">
          <RichTextRender text={data.title} variant="header_1" />
          <div>
            <RichTextRender text={data.description} variant="header_2" />
          </div>
          <Button size="normal">
            <p>
              <span>Консультація</span>
              <MdArrowOutward />
            </p>
          </Button>
        </div>
      </div>
    </Container>
  )
}
