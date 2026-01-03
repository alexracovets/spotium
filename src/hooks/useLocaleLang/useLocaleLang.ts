'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'

/**
 * Хук для оновлення lang атрибута в HTML елементі на основі поточної локалі
 */
export function useLocaleLang() {
  const params = useParams()
  const locale = params?.locale as string | undefined

  useEffect(() => {
    if (locale && typeof document !== 'undefined') {
      document.documentElement.lang = locale
    }
  }, [locale])
}
