'use client'

import { cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'

import { ButtonType } from '@types'
import { cn } from '@utils'

const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 cursor-pointer outline outline-[2px] outline-transparent',
    'focus-visible:outline-primary active:outline-primary',
    'focus-visible:shadow-[0px_0px_6px_white] active:shadow-[0px_0px_6px_white]',
  ),
  {
    variants: {
      variant: {
        default: '',
        navigation: cn(
          'flex justify-end items-center min-w-[280px] gap-x-[24px] disabled:opacity-100 disabled:cursor-pointer outline-none! shadow-none!',
        ),
        destructive: '',
        outline: '',
        secondary: '',
        ghost: '',
        link: '',
      },
      size: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Button = ({
  variant = 'default',
  size = 'default',
  asChild = false,
  className,
  ...props
}: ButtonType) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
