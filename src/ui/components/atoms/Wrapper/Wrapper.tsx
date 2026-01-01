'use client'

import { cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'

import { WrapperType } from '@types'
import { cn } from '@utils'

const variantWrapper = cva('', {
  variants: {
    variant: {
      default: 'w-full',
      app: 'grid grid-rows-[auto_1fr_auto] h-[100dvh] bg-base-bg antialiased',
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
