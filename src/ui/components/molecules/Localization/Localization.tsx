'use client'

import { usePathname } from 'next/navigation'

import type { LocalizationApp, Media } from '@payload-types'
import { switchLocale, getLocaleCodeFromName } from '@utils'
import { Button, ImageAtom, Text } from '@atoms'

type LocalizationProps = {
  lacales: LocalizationApp['lacales']
  currentLocale?: string
}

export const Localization = ({ lacales, currentLocale }: LocalizationProps) => {
  const pathname = usePathname()

  const handleLocaleSwitch = async (localeName: string) => {
    // Знаходимо локаль за ім'ям
    const locale = lacales?.find((l) => l.name?.toLowerCase() === localeName.toLowerCase())
    if (!locale) return

    // Визначаємо код локалі за ім'ям
    const localeCode = getLocaleCodeFromName(locale.name)
    if (!localeCode) return

    // Перемикаємо локаль в URL
    const newPath = switchLocale(pathname, localeCode)

    // Встановлюємо cookie через document.cookie для синхронного доступу
    const maxAge = 60 * 60 * 24 * 365
    document.cookie = `payload-locale=${localeCode}; path=/; max-age=${maxAge}; SameSite=Lax`

    // Оновлюємо cookie через API (для серверної синхронізації)
    try {
      await fetch('/api/locale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locale: localeCode }),
      })
    } catch (error) {
      console.error('Failed to update locale cookie:', error)
    }

    // Використовуємо window.location для форсування повного перезавантаження
    // щоб middleware точно побачив новий cookie
    window.location.href = newPath
  }

  return (
    <div className="absolute right-0 top-0 h-full flex items-center justify-center gap-x-[8px]">
      {lacales?.map((locale) => {
        const localeCode = getLocaleCodeFromName(locale.name)
        const isActive = currentLocale === localeCode

        return (
          <Button
            key={locale.id}
            variant="locale"
            size="small"
            onClick={() => handleLocaleSwitch(locale.name || '')}
            aria-label={`Switch to ${locale.name}`}
            aria-current={isActive ? 'true' : 'false'}
          >
            <Text variant="locale">{locale.name}</Text>
            <ImageAtom variant="locale" image={locale.image as Media} alt={locale.name || ''} />
          </Button>
        )
      })}
    </div>
  )
}
