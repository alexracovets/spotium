'use client'

import { cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'

import { WrapperType } from '@types'
import { cn } from '@utils'

const variantWrapper = cva('', {
  variants: {
    variant: {
      default: 'w-full',
      container: 'px-[50px] mx-auto h-full',
      app: 'relative grid grid-rows-[auto_1fr_auto] h-[100dvh] bg-base-black antialiased text-base-text max-h-screen h-screen',
      header:
        'py-[30px] relative before:absolute before:content-[" "] before:left-0 before:bottom-[-2px] before:w-full before:h-[1px] before:bg-base-white',
      footer:
        'relative py-[30px] relative before:absolute before:content-[" "] before:left-0 before:top-[-2px] before:w-full before:h-[1px] before:bg-base-white',
      heder_wrapper: 'flex  justify-between items-center gap-x-[16px] relative',
      animated_text:
        'flex justify-center items-center gap-[32px] absolute top-0 left-0 w-full h-full z-[-1]',
      navigation_button: 'w-[72px] min-w-[72px] h-[48px] min-h-[48px] relative',
      navigation_button_inner:
        'w-[72px] h-[76px] absolute top-[50%] left-0 translate-y-[-50%] flex items-center justify-center',
      localization: 'absolute right-0 top-0 h-full flex items-center justify-center gap-x-[8px]',
      main_page_wrapper: 'flex py-[64px] flex-col justify-center items-start',
      main_page_content: 'flex flex-col justify-start items-start gap-y-[32px]',
      developments_wrapper: 'max-w-[640px] relative overflow-hidden developments_wrapper_mask',
      developments: 'flex justify-center items-center gap-x-[20px] px-[10px]',
      development_item: 'flex justify-center items-center gap-x-[16px]',
      column: 'flex flex-col justify-start items-start',
      canvas_experience: 'absolute top-0 left-0 w-full h-full',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const Wrapper = ({
  children,
  variant = 'default',
  className,
  asChild = false,
  style,
  ...props
}: WrapperType) => {
  const Component = asChild ? Slot : 'div'

  return (
    <Component className={cn(variantWrapper({ variant, className }))} {...props} style={style}>
      {children}
    </Component>
  )
}

export { Wrapper, variantWrapper }
