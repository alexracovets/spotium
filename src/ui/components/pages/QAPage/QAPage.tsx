'use client'

import { Page } from '@payload-types'

import { useModelsWrapperDimensions } from '@hooks'

export const QAPage = ({ data }: { data: Page }) => {
  useModelsWrapperDimensions()

  if (!data.q_a_type_fields) return null
  const { title, questions } = data.q_a_type_fields

  return (
    <div>
      <h1>QAPage</h1>
    </div>
  )
}
