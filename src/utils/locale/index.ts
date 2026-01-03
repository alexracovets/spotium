const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE as string
const SUPPORTED_LOCALES = [DEFAULT_LOCALE, 'uk'] as const
import { SupportedLocaleType } from '@types'

const getLocaleFromUrl = (pathname: string): SupportedLocaleType['name'] => {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment as SupportedLocaleType['name'])) {
    return firstSegment as SupportedLocaleType['name']
  }

  return DEFAULT_LOCALE as SupportedLocaleType['name']
}

export function getLocalizedHref(
  pathname: string,
  targetLocale: SupportedLocaleType['name'],
): string {
  const locale = getLocaleFromUrl(pathname)
  const pathWithoutLocale = locale ? pathname.replace(`/${locale}`, '') || '/' : pathname || '/'

  if (targetLocale === DEFAULT_LOCALE) {
    return pathWithoutLocale
  }

  return `/${targetLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
}
