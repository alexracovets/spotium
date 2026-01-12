'use client'

import { Case, Page } from '@payload-types'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@atoms'

type AcordionCasesProps = {
  items: NonNullable<NonNullable<Page['cases_type_fields']>['elements']>
}

export const AcordionCases = ({ items }: AcordionCasesProps) => {
  const caseItems = items.filter((item): item is Case => typeof item === 'object' && item !== null)
console.log(caseItems)
  return (
    <Accordion type="single" collapsible>
      {caseItems.map((item, idx) => (
        <AccordionItem key={idx} value={idx.toString()}>
          <AccordionTrigger>1</AccordionTrigger>
          <AccordionContent>2</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
