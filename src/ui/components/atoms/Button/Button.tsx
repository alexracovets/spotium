'use client'

import { cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { MdArrowOutward } from 'react-icons/md'

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
        default: cn(
          'bg-primary text-base-black uppercase font-jetbrains_mono rounded-[100px] leading-[1] shadow-sm shadow-primary',
          'hover:bg-base-black hover:text-primary hover:outline-primary hover:shadow-md',
          '[&>p>svg]:w-0 [&>p>svg]:h-0 [&>p>svg]:translate-y-[100%] [&>p>svg]:rotate-90 [&>p>svg]:transition-all [&>p>svg]:duration-300 [&>p>svg]:ease-linear',

          '[&>p]:flex [&>p]:items-center [&>p]:justify-center [&>p]:gap-x-0 [&>p]:px-[24px] [&>p]:transition-all [&>p]:duration-300 [&>p]:ease-linear',
          'hover:[&>p]:px-0 hover:[&>p>svg]:w-[40px] hover:[&>p>svg]:h-[40px] hover:[&>p]:gap-x-[8px] hover:[&>p>svg]:rotate-0 hover:[&>p>svg]:translate-y-0',
          '[&>svg]:transition-all [&>svg]:duration-300 [&>svg]:ease-in-out',
          'transition-all duration-300 ease-in-out',
        ),
        navigation: cn(
          'flex justify-end items-center min-w-[280px] gap-x-[24px] disabled:opacity-100 disabled:cursor-pointer shadow-none!',
          'outline-none',
        ),
        destructive: '',
        outline: '',
        secondary: '',
        ghost: '',
        email: cn(
          'text-base-dark font-jetbrains_mono flex justify-between items-center w-full max-w-[550px] border border-primary email_bg rounded-[60px]',
          'transition-all duration-300 ease-in-out',
        ),
        link: cn(
          'bg-primary text-base-black uppercase font-jetbrains_mono rounded-[100px] leading-[1] shadow-sm shadow-primary',
          '[&>svg]:my-[7px] hover:[&>svg]:scale-[1.2] hover:[&>svg]:animate-pulse',
          'hover:bg-base-black hover:text-primary hover:outline-primary hover:shadow-md',
          '[&>svg]:transition-all [&>svg]:duration-300 [&>svg]:ease-in-out',
        ),
      },
      size: {
        default: '',
        normal: 'text-[28px] font-[700] px-[24px] py-[8px]',
        link: 'text-[42px] px-[30px] py-[16px]',
        email: 'text-[14px] py-[16px] px-[32px] leading-[1]',
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
  arrow = false,
  children,
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
    >
      {arrow ? (
        <p>
          <span>{children}</span>
          <MdArrowOutward />
        </p>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
