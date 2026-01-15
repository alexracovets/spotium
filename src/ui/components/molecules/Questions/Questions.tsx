'use client'

import { Page } from '@payload-types'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Wrapper } from '@atoms'
import { RichTextRender } from '@molecules'

interface QuestionsProps {
  items: NonNullable<NonNullable<Page['q_a_type_fields']>['questions']>
}

export const Questions = ({ items }: QuestionsProps) => {
  return (
    <Wrapper>
      <Accordion type="single" collapsible>
        {items.map((item, idx) => (
          <AccordionItem key={idx} value={idx.toString()}>
            <AccordionTrigger>
              <RichTextRender text={item.question} variant="medium" />
            </AccordionTrigger>
            <AccordionContent>
              <RichTextRender text={item.answer} variant="primary" />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Wrapper>
  )
}
