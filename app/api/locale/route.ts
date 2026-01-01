import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { locale } = body

    // Validate locale
    if (locale !== 'uk' && locale !== 'en') {
      return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
    }

    // Set locale cookie
    const cookieStore = await cookies()
    cookieStore.set('payload-locale', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      httpOnly: false, // Allow client-side access
    })

    return NextResponse.json({ success: true, locale })
  } catch (error) {
    console.error('Error setting locale:', error)
    return NextResponse.json({ error: 'Failed to set locale' }, { status: 500 })
  }
}

export async function GET() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('payload-locale')?.value || 'uk'

  return NextResponse.json({ locale })
}

