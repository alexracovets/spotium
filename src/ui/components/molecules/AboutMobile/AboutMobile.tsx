'use client'

import { useState, useEffect, useCallback } from 'react'
import { Page } from '@payload-types'

import { RichTextRender } from '@molecules'
import { Wrapper, Text } from '@atoms'

import { getPageCollection } from '@api'
import { SupportedLocaleType } from '@types'

interface AboutMobileProps {
  locale: SupportedLocaleType['name']
}

export const AboutMobile = ({ locale }: AboutMobileProps) => {
  const [data, setData] = useState<Page | null>(null)
  console.log(locale)
  const fetchData = useCallback(async () => {
    const data = await getPageCollection({
      slug: 'about',
      locale: locale,
    })
    console.log(data)
    setData(data.docs[0])
  }, [locale])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Wrapper>
      {data && data.title && (
        <Text variant="primary_heading" asChild>
          <h2> {data.title}</h2>
        </Text>
      )}
      <RichTextRender text={data?.about_type_fields?.description} variant="primary" />
    </Wrapper>
  )
}
