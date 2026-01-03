'use client'

import { cva } from 'class-variance-authority'
import Link from 'next/link'

import { LinkAtomType } from '@types'
import { cn } from '@utils'

const variantsLinkAtom = cva('outline-none!', {
  variants: {
    variant: {
      default: 'bg-red',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const LinkAtom = ({
  variant,
  className,
  children,
  href,
  style,
  target,
  ...props
}: LinkAtomType) => {
  return (
    <Link
      href={href}
      className={cn(variantsLinkAtom({ variant, className }))}
      style={style}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </Link>
  )
}

export { LinkAtom, variantsLinkAtom }
