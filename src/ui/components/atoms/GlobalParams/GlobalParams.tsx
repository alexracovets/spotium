'use client'

import { useEffect } from 'react'

type GlobalParamsProps = {
  locale: string
}

export const GlobalParams = ({ locale }: GlobalParamsProps) => {
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}
