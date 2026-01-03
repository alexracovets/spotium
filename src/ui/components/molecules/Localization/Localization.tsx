'use client'

import { memo } from 'react'
import { usePathname } from 'next/navigation'

import { LocalizationItem } from './LocalizationItem'
import { Wrapper } from '@atoms'

import type { LocalizationApp } from '@payload-types'

type LocalizationProps = {
  lacales: LocalizationApp['lacales']
  currentLocale?: string
}

export const Localization = memo(({ lacales, currentLocale }: LocalizationProps) => {
  const pathname = usePathname()

  return (
    <Wrapper variant="localization">
      {lacales?.map((locale) => {
        if (!locale?.id) return null
        return (
          <LocalizationItem
            key={locale.id}
            locale={locale}
            currentLocale={currentLocale || 'en'}
            pathname={pathname}
          />
        )
      })}
    </Wrapper>
  )
})

Localization.displayName = 'Localization'
