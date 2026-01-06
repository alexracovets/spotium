'use client'

import { Page } from '@payload-types'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@atoms'
import { RichTextRender } from '@molecules'

type AcordionBlockProps = {
  items: NonNullable<NonNullable<Page['services_type_fields']>['services']>
  setIsTrigger: (isTrigger: boolean) => void
}

export const AcordionBlock = ({ items, setIsTrigger }: AcordionBlockProps) => {
  return (
    <Accordion type="single" collapsible onValueChange={() => setIsTrigger(true)}>
      {items.map((item, idx) => (
        <AccordionItem key={idx} value={idx.toString()}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent triger>
            <RichTextRender text={item.description} variant="primary" />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
