'use client'

import { cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'

import { TextType } from '@types'
import { cn } from '@utils'

const variantText = cva('font-jetbrains_mono font-medium', {
  variants: {
    variant: {
      default: '',
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
      header_1: cn('text-[80px] font-bebas_neue uppercase text-base-white leading-[1]'),
      header_pages: cn('text-[64px] font-dm_sans font-[800] uppercase text-primary leading-[1]'),
      header_2: cn('text-[40px] uppercase text-base-white font-[700] leading-[1]'),
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
