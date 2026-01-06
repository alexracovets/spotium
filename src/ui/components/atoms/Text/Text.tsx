'use client'

import { cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'

import { TextType } from '@types'
import { cn } from '@utils'

const variantText = cva('font-jetbrains_mono font-medium', {
  variants: {
    variant: {
      default: '',
      main_heading: cn('text-[80px] font-bebas_neue uppercase text-base-white leading-[1]'),
      main_paragraph: cn('text-[40px] uppercase text-base-white font-[700] leading-[1]'),
      main_list: cn('text-[16px] font-jetbrains_mono text-base-white'),
      main_list_item: cn('text-[16px] font-jetbrains_mono text-base-white'),
      primary_paragraph: cn('text-[16px] font-jetbrains_mono text-base-white'),
      primary_heading: cn('text-[64px] font-dm_sans font-[800] uppercase text-primary leading-[1]'),
      primary_list: cn('text-[16px] font-jetbrains_mono text-base-white'),
      primary_list_item: cn(
        'pl-[32px] text-[16px] font-jetbrains_mono text-base-white relative',
        "before:content-[''] before:absolute before:w-[8px] before:h-[8px]",
        'before:left-[16px] before:translate-x-[-50%] before:top-[8px]',
        'before:rounded-full before:bg-base-white',
        'hover:before:bg-primary',
        'transition-all duration-300 ease-in-out',
      ),
      animated_text_first_word: cn(
        'text-[32px] font-press_start',
        'opacity-0 -translate-y-2.5 transition-all duration-300 ease-in-out',
        '[&[data-active="true"]]:opacity-100 [&[data-active="true"]]:translate-y-0',
      ),
      animated_text_second_word: cn(
        'text-[32px] font-press_start text-primary',
        'opacity-0 -translate-y-2.5 transition-all duration-300 ease-in-out',
        '[&[data-active="true"]]:opacity-100 [&[data-active="true"]]:translate-y-0',
      ),
      navigation_button: cn(
        'text-[32px] font-press_start uppercase text-base-white',
        "data-[active='true']:text-primary",
        'transition-all duration-300 ease-in-out',
      ),
      footer: cn(
        'text-[16px] font-jetbrains_mono text-center font-medium text-base-white uppercase',
      ),
      locale: cn(
        'text-[16px] font-jetbrains_mono text-center text-base-white uppercase',
        "data-[active='true']:text-primary",
        'transition-all duration-300 ease-in-out',
      ),
      development: cn(
        'text-[14px] text-neutral-white font-dm_sans font-[700] uppercase leading-[1]',
      ),
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const Text = ({ className, variant, asChild = false, children, ...props }: TextType) => {
  const Comp = asChild ? Slot : 'p'

  return (
    <Comp data-slot="text" className={cn(variantText({ variant, className }))} {...props}>
      {children}
    </Comp>
  )
}

export { Text, variantText }
