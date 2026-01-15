'use client'

import { RichTextRender } from '@molecules'
import { Page } from '@payload-types'

type MainTitleProps = {
  title_main: NonNullable<Page['main_type_fields']>['title_main']
}

export const MainTitle = ({ title_main }: MainTitleProps) => {
  return <>{title_main && <RichTextRender text={title_main} variant="main" />}</>
}
