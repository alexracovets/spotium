'use client'

import { cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'

import { ButtonType } from '@types'
import { cn } from '@utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 outline-none cursor-pointer',
  {
    variants: {
      variant: {
        default: '',
        navigation: 'w-[72px] min-w-[72px] h-[48px] min-h-[48px] relative',
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
