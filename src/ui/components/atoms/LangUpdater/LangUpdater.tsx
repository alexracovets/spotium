'use client'

import { useEffect } from 'react'

type LangUpdaterProps = {
  locale: string
}

export const LangUpdater = ({ locale }: LangUpdaterProps) => {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}
