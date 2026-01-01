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
          'w-[72px] h-[48px] bg-base-white rounded-full relative',
          "before:content-[''] before:absolute before:top-[50%] before:left-[20px] before:translate-x-[-50%] before:translate-y-[-50%] before:w-[10px] before:h-[10px] before:bg-base-bg before:rounded-full before:transition-all before:duration-300 before:ease-in-out",
          "after:content-[''] after:absolute after:bottom-[50%] after:right-[20px] after:translate-x-[50%] after:translate-y-[50%] after:w-[10px] after:h-[10px] after:bg-base-bg after:rounded-full after:transition-all after:duration-300 after:ease-in-out",
          'transition-all duration-300 ease-in-out',
          'focus-visible:w-[48px] focus-visible:h-[72px] focus-visible:after:bottom-[20px] focus-visible:after:right-[50%] focus-visible:before:top-[20px] focus-visible:before:left-[50%] focus-visible:before:w-[20px] focus-visible:before:h-[20px]',
          '[&[data-open="true"]]:w-[48px] [&[data-open="true"]]:h-[72px] [&[data-open="true"]]:after:bottom-[20px] [&[data-open="true"]]:after:right-[50%] [&[data-open="true"]]:before:top-[20px] [&[data-open="true"]]:before:left-[50%] [&[data-open="true"]]:before:w-[20px] [&[data-open="true"]]:before:h-[20px] [&[data-open="true"]]:shadow-[0px_0px_6px_white] [&[data-open="true"]]:outline-primary',
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
