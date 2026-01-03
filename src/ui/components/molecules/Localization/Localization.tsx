'use client'

import { usePathname, useParams } from 'next/navigation'

import { LocalizationItem } from './LocalizationItem'
import { Wrapper } from '@atoms'

import type { LocalizationApp } from '@payload-types'

type LocalizationProps = {
  lacales: LocalizationApp['lacales']
  currentLocale?: string
}

export const Localization = ({ lacales, currentLocale: propCurrentLocale }: LocalizationProps) => {
  const pathname = usePathname()
  const params = useParams()
  const localeFromParams = params?.locale as string | undefined
  const currentLocale = propCurrentLocale || localeFromParams || 'en'

  return (
    <Wrapper variant="localization">
      {lacales?.map((locale) => {
        if (!locale?.id) return null
        return (
          <LocalizationItem
            key={locale.id}
            locale={locale}
            currentLocale={currentLocale}
            pathname={pathname}
          />
        )
      })}
    </Wrapper>
  )
}
