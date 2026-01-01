import { cookies, headers } from 'next/headers'

export type Locale = 'uk' | 'en'

// Payload config values (hardcoded to avoid async import issues)
const DEFAULT_LOCALE: Locale = 'uk'
const AVAILABLE_LOCALES: Locale[] = ['uk', 'en']

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const headersList = await headers()

  // Try to get locale from cookie (set by language switche)
  const localeCookie = cookieStore.get('payload-locale')
  if (localeCookie?.value && isValidLocale(localeCookie.value)) {
    return localeCookie.value as Locale
  }

  // Try to get from Accept-Language header
  const acceptLanguage = headersList.get('accept-language')
  if (acceptLanguage) {
    const preferredLang = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase()
    if (preferredLang === 'uk' || preferredLang === 'en') {
      return preferredLang as Locale
    }
  }

  // Fallback to default locale
  return DEFAULT_LOCALE
}

/**
 * Check if locale is valid
 */
function isValidLocale(locale: string): locale is Locale {
  return locale === 'uk' || locale === 'en'
}

/**
 * Get all available locales from Payload config
 */
export function getAvailableLocales(): Locale[] {
  return AVAILABLE_LOCALES
}

/**
 * Get locale display name
 */
export function getLocaleName(locale: Locale): string {
  const names: Record<Locale, string> = {
    uk: 'Українська',
    en: 'English',
  }
  return names[locale]
}
