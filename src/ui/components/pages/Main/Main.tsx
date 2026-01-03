'use client'

import { RichTextRender } from '@molecules'
import { MdArrowOutward } from 'react-icons/md'

import { Page } from '@payload-types'
import { Button } from '@atoms'

type MainProps = {
  data: Page
}

export const Main = ({ data }: MainProps) => {
  return (
    <div className="flex flex-col justify-center items-start h-full min-h-0">
      <div className="flex flex-col justify-start items-start gap-y-[24px]">
        <RichTextRender text={data.title} variant="header_1" />
        <div>
          <RichTextRender text={data.description} variant="header_2" />
        </div>
        {data.button && (
          <Button size="normal">
            <p>
              <span>{data.button}</span>
              <MdArrowOutward />
            </p>
          </Button>
        )}
      </div>
    </div>
  )
}
