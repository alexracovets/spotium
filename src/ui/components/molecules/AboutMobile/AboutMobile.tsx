'use client'

import { useState, useEffect, useCallback } from 'react'
import { Page, Media } from '@payload-types'

import { Wrapper, Text, ImageAtom } from '@atoms'
import { RichTextRender } from '@molecules'

import { SupportedLocaleType } from '@types'
import { getPageCollection } from '@api'

interface AboutMobileProps {
  locale: SupportedLocaleType['name']
}

export const AboutMobile = ({ locale }: AboutMobileProps) => {
  const [data, setData] = useState<Page | null>(null)

  const fetchData = useCallback(async () => {
    const data = await getPageCollection({
      slug: 'about',
      locale: locale,
    })
    setData(data.docs[0])
  }, [locale])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Wrapper variant="about_content_wrapper">
      {data && data.title && (
        <Text variant="primary_heading" asChild>
          <h2>{data.title}</h2>
        </Text>
      )}
      <Wrapper variant="about_content">
        <Text variant="about_content_title">{data?.about_type_fields?.subtitle}</Text>
        <Wrapper variant="about_content_text">
          <RichTextRender text={data?.about_type_fields?.description} variant="primary" />
        </Wrapper>
      </Wrapper>
      <Wrapper variant="about_content">
        <Wrapper variant="about_developments">
          {data?.about_type_fields?.developments?.map((development, idx) => {
            return (
              <Wrapper
                key={idx}
                variant="about_developments_item"
              >
                <ImageAtom
                  image={development.image as Media}
                  alt={development.name}
                  variant="development_about"
                />
                <Text variant="about_developments_item">{development.name}</Text>
              </Wrapper>
            )
          })}
        </Wrapper>
      </Wrapper>
    </Wrapper>
  )
}
