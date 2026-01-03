import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { locale } = body

    //Зберігаємо кукі
    const cookieStore = await cookies()
    cookieStore.set('payload-locale', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      httpOnly: false,
    })

    return NextResponse.json({ success: true, locale })
  } catch (error) {
    console.error('Error setting locale:', error)
    return NextResponse.json({ error: 'Failed to set locale' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()

  // Спробуємо отримати локаль з URL, якщо вона там є
  const { pathname } = request.nextUrl
  const urlLocale = pathname.split('/')[1]

  let locale = cookieStore.get('payload-locale')?.value || 'en'

  // Якщо локаль в URL валідна, використовуємо її
  if (urlLocale) {
    locale = urlLocale || 'en'
  }

  return NextResponse.json({ locale })
}
