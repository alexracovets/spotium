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
      app: 'grid grid-rows-[auto_1fr_auto] h-[100dvh] bg-base-bg antialiased text-base-text',
      header:
        'py-[30px] relative before:absolute before:content-[" "] before:left-0 before:bottom-[-2px] before:w-full before:h-[1px] before:bg-base-white',
      heder_wrapper: 'grid grid-cols-[auto_1fr_auto] items-center gap-x-[16px]',
      animated_text: 'flex justify-center items-center gap-[32px]',
      navigation_button: cn(
        'w-[72px] h-[48px] bg-base-white rounded-full relative',
        "before:content-[''] before:absolute before:top-[50%] before:left-[20px] before:translate-x-[-50%] before:translate-y-[-50%] before:w-[10px] before:h-[10px] before:bg-base-bg before:rounded-full before:transition-all before:duration-300 before:ease-in-out",
        "after:content-[''] after:absolute after:bottom-[50%] after:right-[20px] after:translate-x-[50%] after:translate-y-[50%] after:w-[10px] after:h-[10px] after:bg-base-bg after:rounded-full after:transition-all after:duration-300 after:ease-in-out",
        'transition-all duration-300 ease-in-out',
        '[&[data-open="true"]]:w-[48px] [&[data-open="true"]]:h-[72px] [&[data-open="true"]]:after:bottom-[20px] [&[data-open="true"]]:after:right-[50%] [&[data-open="true"]]:before:top-[20px] [&[data-open="true"]]:before:left-[50%] [&[data-open="true"]]:before:w-[20px] [&[data-open="true"]]:before:h-[20px]',
      ),
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
