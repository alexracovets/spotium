'use client'

import { cva } from 'class-variance-authority'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { LinkAtomType } from '@types'
import { cn } from '@utils'
import { addLocaleToPath } from '@utils'

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
  const params = useParams()
  const locale = params?.locale as string | undefined

  // Якщо це зовнішнє посилання або href вже містить локаль, використовуємо як є
  const isExternal =
    href?.startsWith('http') ||
    href?.startsWith('//') ||
    href?.startsWith('mailto:') ||
    href?.startsWith('tel:')
  const hasLocale = locale && href && (href.startsWith(`/${locale}/`) || href === `/${locale}`)

  // Додаємо локаль до внутрішніх посилань
  const finalHref =
    isExternal || hasLocale || !locale || !href
      ? href
      : addLocaleToPath(href, locale as 'uk' | 'en')

  return (
    <Link
      href={finalHref}
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
