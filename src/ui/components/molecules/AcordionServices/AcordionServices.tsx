'use client'

import { Page } from '@payload-types'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@atoms'
import { RichTextRender } from '@molecules'

type AcordionServicesProps = {
  items: NonNullable<NonNullable<Page['services_type_fields']>['services']>
  onOpenChange?: (itemId: string | null) => void
}

export const AcordionServices = ({ items, onOpenChange }: AcordionServicesProps) => {
  return (
    <Accordion type="single" collapsible onValueChange={(value) => onOpenChange ? onOpenChange(value || null) : null}>
      {items.map((item, idx) => (
        <AccordionItem key={idx} value={idx.toString()}>
          <AccordionTrigger data-accordion-trigger-id={idx.toString()}>
            {item.title}
          </AccordionTrigger>
          <AccordionContent triger>
            <RichTextRender text={item.description} variant="primary" />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
