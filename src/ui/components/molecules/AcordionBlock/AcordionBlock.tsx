'use client'

import { Page } from '@payload-types'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@atoms'
import { RichTextRender } from '@molecules'

type AcordionBlockProps = {
  items: NonNullable<NonNullable<Page['services_type_fields']>['services']>
}

export const AcordionBlock = ({ items }: AcordionBlockProps) => {
  return (
    <Accordion type="single" collapsible>
      {items.map((item, idx) => (
        <AccordionItem key={idx} value={idx.toString()}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent triger>
            <RichTextRender text={item.description} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
