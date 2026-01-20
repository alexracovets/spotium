"use client"

import { useState, useEffect, useCallback } from 'react'
import { Page } from '@payload-types'

import { AcordionServices } from '@molecules'

import { SupportedLocaleType } from '@types'
import { getPageCollection } from '@api'

interface ServicesMobileProps {
    locale: SupportedLocaleType['name']
}

export const ServicesMobile = ({ locale }: ServicesMobileProps) => {
    const [data, setData] = useState<Page | null>(null)
    const fetchData = useCallback(async () => {
        const data = await getPageCollection({
            slug: 'services',
            locale: locale,
        })
        setData(data.docs[0])
    }, [locale])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    if (!data?.services_type_fields) return null

    const { services, button } = data.services_type_fields

    return (
        <div>
            {services && <AcordionServices items={services} />}
        </div>
    )
}