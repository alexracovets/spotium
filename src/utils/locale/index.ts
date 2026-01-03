const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE as string
const SUPPORTED_LOCALES = [DEFAULT_LOCALE, 'uk'] as const
import { SupportedLocaleType } from '@types'

const getLocaleFromUrl = (pathname: string): SupportedLocaleType['name'] | null => {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment as SupportedLocaleType['name'])) {
    return firstSegment as SupportedLocaleType['name']
  }

  return null
}

export function getLocalizedHref(
  pathname: string,
  targetLocale: SupportedLocaleType['name'],
): string {
  // Нормалізуємо pathname
  const normalizedPathname = pathname || '/'

  // Визначаємо поточну локаль з URL
  const currentLocale = getLocaleFromUrl(normalizedPathname)

  // Видаляємо локаль з pathname, якщо вона є
  let pathWithoutLocale: string
  if (currentLocale) {
    // Видаляємо локаль з початку pathname
    pathWithoutLocale = normalizedPathname.replace(`/${currentLocale}`, '') || '/'
    // Видаляємо подвійні слеші
    pathWithoutLocale = pathWithoutLocale.replace(/\/+/g, '/')
    // Якщо pathname був тільки `/uk`, то після replace залишиться порожній рядок
    if (!pathWithoutLocale || pathWithoutLocale === '') {
      pathWithoutLocale = '/'
    }
  } else {
    // Якщо локалі немає в URL, це означає дефолтна локаль
    pathWithoutLocale = normalizedPathname === '/' ? '/' : normalizedPathname
  }

  // Якщо цільова локаль - дефолтна, повертаємо pathname без локалі
  if (targetLocale === DEFAULT_LOCALE) {
    return pathWithoutLocale
  }

  // Для не-дефолтної локалі додаємо префікс
  return `/${targetLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
}
