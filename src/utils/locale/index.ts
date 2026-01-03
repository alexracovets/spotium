const SUPPORTED_LOCALES = ['uk', 'en'] as const
const DEFAULT_LOCALE = 'en'

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

/**
 * Отримує локаль з URL pathname
 * @param pathname - шлях URL (наприклад, '/uk/page' або '/en')
 * @returns локаль або null якщо не знайдено
 */
export function getLocaleFromUrl(pathname: string): SupportedLocale | null {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]

  if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment as SupportedLocale)) {
    return firstSegment as SupportedLocale
  }

  return null
}

/**
 * Додає локаль до шляху
 * @param path - шлях без локалі (наприклад, '/page' або '/about')
 * @param locale - локаль для додавання
 * @returns шлях з локаллю (наприклад, '/uk/page') або без локалі для дефолтної мови
 */
export function addLocaleToPath(path: string, locale: SupportedLocale): string {
  // Для дефолтної мови не додаємо locale в URL
  if (locale === DEFAULT_LOCALE) {
    const existingLocale = getLocaleFromUrl(path)
    if (existingLocale) {
      // Якщо шлях вже містить локаль, видаляємо її
      return removeLocaleFromPath(path)
    }
    // Якщо локалі немає, повертаємо path як є
    return path
  }

  // Якщо шлях вже починається з локалі, замінюємо її
  const existingLocale = getLocaleFromUrl(path)
  if (existingLocale) {
    return path.replace(`/${existingLocale}`, `/${locale}`)
  }

  // Якщо шлях порожній або '/', повертаємо просто '/locale'
  if (path === '/' || path === '') {
    return `/${locale}`
  }

  // Додаємо локаль на початок шляху
  return `/${locale}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Перемикає локаль в поточному шляху
 * @param currentPath - поточний шлях з локаллю (наприклад, '/uk/page') або без неї
 * @param newLocale - нова локаль
 * @returns новий шлях з новою локаллю (наприклад, '/uk/page') або без локалі для дефолтної
 */
export function switchLocale(currentPath: string, newLocale: SupportedLocale): string {
  // Для дефолтної мови видаляємо locale з URL
  if (newLocale === DEFAULT_LOCALE) {
    return removeLocaleFromPath(currentPath)
  }

  const currentLocale = getLocaleFromUrl(currentPath)

  if (currentLocale) {
    // Замінюємо поточну локаль на нову
    return currentPath.replace(`/${currentLocale}`, `/${newLocale}`)
  }

  // Якщо локалі немає, додаємо нову
  return addLocaleToPath(currentPath, newLocale)
}

/**
 * Видаляє локаль з шляху
 * @param pathname - шлях з локаллю (наприклад, '/uk/page')
 * @returns шлях без локалі (наприклад, '/page')
 */
export function removeLocaleFromPath(pathname: string): string {
  const locale = getLocaleFromUrl(pathname)
  if (locale) {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '')
    return pathWithoutLocale || '/'
  }
  return pathname
}

/**
 * Визначає код локалі за ім'ям
 * @param name - ім'я локалі (наприклад, 'Українська', 'English')
 * @returns код локалі ('uk' або 'en') або null
 */
export function getLocaleCodeFromName(name: string | null | undefined): SupportedLocale | null {
  if (!name) return null

  const lowerName = name.toLowerCase().trim()

  // Українська мова
  if (
    lowerName === 'українська' ||
    lowerName === 'ukrainian' ||
    lowerName === 'uk' ||
    lowerName.includes('укр')
  ) {
    return 'uk'
  }

  // Англійська мова
  if (
    lowerName === 'english' ||
    lowerName === 'англійська' ||
    lowerName === 'en' ||
    lowerName.includes('eng')
  ) {
    return 'en'
  }

  return null
}

export { SUPPORTED_LOCALES, DEFAULT_LOCALE }
export type { SupportedLocale }
