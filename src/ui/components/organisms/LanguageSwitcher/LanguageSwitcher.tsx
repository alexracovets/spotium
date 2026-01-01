'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Button } from '../../atoms'

export type Locale = 'uk' | 'en'

export interface LanguageSwitcherProps {
  currentLocale: Locale
  availableLocales: Locale[]
  className?: string
}

const localeNames: Record<Locale, string> = {
  uk: 'УК',
  en: 'EN',
}

const localeFullNames: Record<Locale, string> = {
  uk: 'Українська',
  en: 'English',
}

export function LanguageSwitcher({
  currentLocale,
  availableLocales,
  className = '',
}: LanguageSwitcherProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isChanging, setIsChanging] = useState(false)

  const handleLocaleChange = async (newLocale: Locale) => {
    if (newLocale === currentLocale || isChanging) return

    setIsChanging(true)

    try {
      // Set locale cookie
      await fetch('/api/locale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locale: newLocale }),
      })

      // Refresh the page to apply new locale
      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      console.error('Failed to change locale:', error)
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {availableLocales.map((locale) => {
        const isActive = locale === currentLocale
        return (
          <Button
            key={locale}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleLocaleChange(locale)}
            disabled={isPending || isChanging}
            className="min-w-[3rem]"
            title={localeFullNames[locale]}
          >
            {localeNames[locale]}
          </Button>
        )
      })}
    </div>
  )
}
