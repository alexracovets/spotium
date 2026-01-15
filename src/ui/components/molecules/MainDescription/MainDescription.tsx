'use client'

import { RichTextRender } from '@molecules'
import { Wrapper } from '@atoms'

import { Page } from '@payload-types'

type MainDescriptionProps = {
  description: NonNullable<Page['main_type_fields']>['description']
}

export const MainDescription = ({ description }: MainDescriptionProps) => {
  return (
    <>
      {description && (
        <Wrapper className="max-sm:order-4 max-sm:max-w-[300px] max-sm:mx-auto">
          <RichTextRender text={description} variant="main" />
        </Wrapper>
      )}
    </>
  )
}
