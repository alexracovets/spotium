'use client'

import { cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'

import { WrapperType } from '@types'
import { cn } from '@utils'

const variantWrapper = cva('', {
  variants: {
    variant: {
      default: 'w-full',
      container: 'px-[50px] mx-auto',
      app: 'grid grid-rows-[auto_1fr_auto] h-[100dvh] bg-base-black antialiased text-base-text',
      header:
        'py-[30px] relative before:absolute before:content-[" "] before:left-0 before:bottom-[-2px] before:w-full before:h-[1px] before:bg-base-white',
      footer:
        'py-[30px] relative before:absolute before:content-[" "] before:left-0 before:top-[-2px] before:w-full before:h-[1px] before:bg-base-white',
      heder_wrapper: 'flex  justify-between items-center gap-x-[16px] relative',
      animated_text:
        'flex justify-center items-center gap-[32px] absolute top-0 left-0 w-full h-full z-[-1]',
      navigation_button: 'w-[72px] min-w-[72px] h-[48px] min-h-[48px] relative',
      navigation_button_inner:
        'w-[72px] h-[76px] absolute top-[50%] left-0 translate-y-[-50%] flex items-center justify-center',
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
