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
      app: 'grid grid-rows-[auto_1fr_auto] h-[100dvh] bg-base-bg antialiased',
      header:
        'py-[30px] relative before:absolute before:content-[" "] before:left-0 before:bottom-[-2px] before:w-full before:h-[1px] before:bg-base-white',
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
