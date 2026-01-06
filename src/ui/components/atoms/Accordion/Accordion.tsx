'use client'

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from 'lucide-react'
import { cva } from 'class-variance-authority'

import { cn } from '@utils'

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className="flex flex-col gap-y-[8px] w-full"
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        'w-full border-b border-base-white',
        'data-[state=open]:border-primary',
        'transition-all duration-300 ease-in-out',
        className,
      )}
      {...props}
    />
  )
}

const accordionTriggerVariants = cva(
  cn(
    'flex flex-1 items-start justify-between outline-none w-full cursor-pointer',
    'text-[26px] py-[8px]',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&[data-state=open]]:text-primary [&[data-state=open]>svg]:rotate-180',
    'transition-all duration-300 ease-in-out',
  ),
  {
    variants: {
      variant: {
        default: cn(''),
      },
    },
  },
)

interface AccordionTriggerProps extends React.ComponentProps<typeof AccordionPrimitive.Trigger> {
  variant?: 'default'
}

function AccordionTrigger({
  className,
  children,
  variant = 'default',
  ...props
}: AccordionTriggerProps) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(accordionTriggerVariants({ variant }), className)}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-8 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

interface AccordionContentProps extends React.ComponentProps<typeof AccordionPrimitive.Content> {
  triger?: boolean
}

function AccordionContent({ className, children, triger, ...props }: AccordionContentProps) {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const observer = new MutationObserver(() => {
      setIsOpen(content.getAttribute('data-state') === 'open')
    })

    observer.observe(content, {
      attributes: true,
      attributeFilter: ['data-state'],
    })

    setIsOpen(content.getAttribute('data-state') === 'open')

    return () => observer.disconnect()
  }, [])

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (triger && isOpen && contentRef.current) {
        e.stopPropagation()
        // Знаходимо батьківський AccordionItem
        const item = contentRef.current.closest('[data-slot="accordion-item"]')
        if (item) {
          // Знаходимо trigger елемент
          const trigger = item.querySelector<HTMLElement>('[data-slot="accordion-trigger"]')
          if (trigger) {
            trigger.click()
          }
        }
      }
    },
    [triger, isOpen],
  )

  return (
    <AccordionPrimitive.Content
      ref={contentRef}
      data-slot="accordion-content"
      className={cn(
        'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        'overflow-hidden',
        triger && isOpen && 'cursor-pointer',
      )}
      {...props}
    >
      <div
        className={cn('bg-bg-content p-[16px] rounded-[8px] mb-[16px]', className)}
        onClick={triger ? handleClick : undefined}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
