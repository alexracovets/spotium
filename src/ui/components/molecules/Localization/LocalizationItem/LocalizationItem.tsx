'use client'

import { ImageAtom, LinkAtom, Text } from '@atoms'

import type { LocalizationApp, Media } from '@payload-types'
import { SupportedLocaleType } from '@types'
import { getLocalizedHref } from '@utils'
import { useState } from 'react'

interface LocalizationItemProps {
  locale: NonNullable<LocalizationApp['lacales']>[number]
  currentLocale: string
  pathname: string
}

export const LocalizationItem = ({ locale, currentLocale, pathname }: LocalizationItemProps) => {
  const [isHovered, setIsHovered] = useState(false)
  if (!locale?.name) return null
  const isActive = currentLocale === locale.name

  return (
    <LinkAtom
      href={getLocalizedHref(pathname, locale.name as SupportedLocaleType['name'])}
      variant="locale"
      aria-label={`Switch to ${locale.name}`}
      aria-current={isActive ? 'true' : 'false'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Text variant="locale" data-active={isActive || isHovered}>
        {locale.name}
      </Text>
      <ImageAtom
        variant="locale"
        disabled={!isActive && !isHovered}
        image={locale.image as Media}
        alt={locale.name}
      />
    </LinkAtom>
  )
}
