'use client'

import { Page } from '@payload-types'
import { useState, useEffect } from 'react'

import { getPageCollection } from '@api'

export const AboutMobile = ({ locale }: { locale: string }) => {
  const [data, setData] = useState<Page | null>(null)

  const fetchData = async () => {
    const data = await getPageCollection({
      slug: 'about',
      locale: locale,
    })
    setData(data.docs[0])
  }

  useEffect(() => {
    fetchData()
  }, [])
  
  return <h1>AboutMobile</h1>
}
