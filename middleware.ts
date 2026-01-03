import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPPORTED_LOCALES = ['uk', 'en'] as const
const DEFAULT_LOCALE = 'en'

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
}

function getLocaleFromCookie(request: NextRequest): string | null {
  return request.cookies.get('payload-locale')?.value || null
}

function getLocaleFromHeader(request: NextRequest): string | null {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return null

  // Перевіряємо чи є українська мова в заголовках
  if (acceptLanguage.includes('uk')) return 'uk'
  if (acceptLanguage.includes('en')) return 'en'

  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаємо статичні файли, API routes та Payload admin
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Перевіряємо чи є локаль в URL
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  const pathLocale = pathname.split('/')[1]

  // Якщо URL містить /en/, перенаправляємо на URL без /en/
  if (pathLocale === DEFAULT_LOCALE) {
    const pathWithoutLocale = pathname.replace(`/${DEFAULT_LOCALE}`, '') || '/'
    const newUrl = request.nextUrl.clone()
    newUrl.pathname = pathWithoutLocale

    const response = NextResponse.redirect(newUrl)
    response.cookies.set('payload-locale', DEFAULT_LOCALE, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: false,
    })

    return response
  }

  // Якщо це кореневий шлях або шлях без локалі
  if (pathname === '/' || !pathnameHasLocale) {
    // Перевіряємо query параметр для явного перемикання локалі
    const localeParam = request.nextUrl.searchParams.get('locale')
    const explicitLocale = localeParam && isValidLocale(localeParam) ? localeParam : null

    // Перевіряємо referer для визначення явного переходу на дефолтну локаль
    const referer = request.headers.get('referer') || ''
    let refererHasUk = false
    if (referer) {
      try {
        const refererUrl = new URL(referer)
        const refererPath = refererUrl.pathname || ''
        refererHasUk = refererPath.includes('/uk') && refererUrl.origin === request.nextUrl.origin
      } catch {
        // Якщо referer не є валідним URL, ігноруємо його
      }
    }

    // Визначаємо локаль з cookies або headers
    const localeFromCookie = getLocaleFromCookie(request)
    const localeFromHeader = getLocaleFromHeader(request)

    // Якщо є явний query параметр, використовуємо його
    // Або якщо referer містить /uk і користувач переходить на /,
    // це явний перехід на дефолтну локаль - ігноруємо cookie
    let targetLocale: string
    if (explicitLocale) {
      targetLocale = explicitLocale
    } else if (pathname === '/' && refererHasUk) {
      targetLocale = DEFAULT_LOCALE
    } else {
      targetLocale =
        localeFromCookie && isValidLocale(localeFromCookie)
          ? localeFromCookie
          : localeFromHeader && isValidLocale(localeFromHeader)
            ? localeFromHeader
            : DEFAULT_LOCALE
    }

    // Для дефолтної мови використовуємо rewrite (URL залишається без /en)
    if (targetLocale === DEFAULT_LOCALE) {
      const newUrl = request.nextUrl.clone()
      newUrl.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`

      // Якщо є query параметр locale для явного перемикання, використовуємо redirect
      // щоб видалити його з URL
      if (explicitLocale) {
        const cleanUrl = request.nextUrl.clone()
        cleanUrl.pathname = pathname
        cleanUrl.searchParams.delete('locale')

        const response = NextResponse.redirect(cleanUrl)
        response.cookies.set('payload-locale', DEFAULT_LOCALE, {
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
          sameSite: 'lax',
          httpOnly: false,
        })

        return response
      }

      const response = NextResponse.rewrite(newUrl)
      response.cookies.set('payload-locale', DEFAULT_LOCALE, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        httpOnly: false,
      })

      return response
    }

    // Для не-дефолтної мови перенаправляємо на URL з локаллю
    const newUrl = request.nextUrl.clone()
    newUrl.pathname = `/${targetLocale}${pathname === '/' ? '' : pathname}`

    const response = NextResponse.redirect(newUrl)
    response.cookies.set('payload-locale', targetLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: false,
    })

    return response
  }

  // Якщо локаль є в URL, перевіряємо чи вона валідна
  if (pathLocale && !isValidLocale(pathLocale)) {
    // Якщо невалідна локаль, rewrite на дефолтну (без /en в URL)
    const newUrl = request.nextUrl.clone()
    const pathWithoutInvalidLocale = pathname.replace(`/${pathLocale}`, '') || '/'
    newUrl.pathname = `/${DEFAULT_LOCALE}${pathWithoutInvalidLocale === '/' ? '' : pathWithoutInvalidLocale}`

    const response = NextResponse.rewrite(newUrl)
    response.cookies.set('payload-locale', DEFAULT_LOCALE, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: false,
    })

    return response
  }

  // Якщо локаль валідна (uk), встановлюємо cookie та продовжуємо
  if (pathLocale && isValidLocale(pathLocale)) {
    const response = NextResponse.next()
    response.cookies.set('payload-locale', pathLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: false,
    })

    // Додаємо headers для оптимізації попереднього завантаження
    // Вказуємо поточну локаль для правильного керування ресурсами
    response.headers.set('x-middleware-locale', pathLocale)

    return response
  }

  const response = NextResponse.next()
  // Для дефолтної локалі також додаємо header
  if (!pathnameHasLocale) {
    response.headers.set('x-middleware-locale', DEFAULT_LOCALE)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
