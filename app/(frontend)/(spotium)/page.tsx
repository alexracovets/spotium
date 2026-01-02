import React from 'react'
import { getPayload } from 'payload'
import { Page } from '@payload-types'

import config from '@payload-config'

import { Main } from '@pages'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const page = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: '/',
      },
    },
  })

  const data = page.docs[0] as Page

  return <Main data={data} />
}
