'use client'

import { memo } from 'react'
import { usePathname } from 'next/navigation'

import { ImageAtom, LinkAtom, Text, Wrapper } from '@atoms'

import type { LocalizationApp, Media } from '@payload-types'
import { SupportedLocaleType } from '@types'
import { getLocalizedHref } from '@utils'
import { useState } from 'react'

type LocalizationProps = {
  lacales: LocalizationApp['lacales']
  currentLocale?: string
}

export const Localization = memo(({ lacales, currentLocale }: LocalizationProps) => {
  const pathname = usePathname()

  return (
    <Wrapper variant="localization">
      {lacales?.map((locale) => {
        if (!locale.name) return null
        const isActive = currentLocale === locale.name
        const [isHovered, setIsHovered] = useState(false)

        return (
          <LinkAtom
            href={getLocalizedHref(pathname, locale.name as SupportedLocaleType['name'])}
            key={locale.id}
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
      })}
    </Wrapper>
  )
})

Localization.displayName = 'Localization'
