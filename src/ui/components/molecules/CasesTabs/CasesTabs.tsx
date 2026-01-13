'use client'

import { Case } from '@payload-types'
import { Wrapper, Text } from '@atoms'

type CasesTabsProps = {
  items: NonNullable<NonNullable<Case['tabs']>>
}

export const CasesTabs = ({ items }: CasesTabsProps) => {
  return (
    <Wrapper>
      <Text>CasesTabs</Text>
    </Wrapper>
  )
}
