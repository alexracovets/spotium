'use client'

import { cva } from 'class-variance-authority'
import Image from 'next/image'

import { ImageType } from '@types'
import { cn } from '@utils'

const variantsImage = cva('', {
  variants: {
    variant: {
      default: 'w-full',
      logo: 'w-[152px] h-[41px]',
      locale: cn(
        'w-[22px] h-[16px]',
        "data-[disabled='true']:grayscale-100",
        'transition-all duration-300 ease-in-out',
      ),
      development: 'w-[48px] h-[24px]',
      cases: 'w-[580px] h-[322px] rounded-[10px] overflow-hidden',
      development_about: 'w-[18px] h-[18px]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const ImageAtom = ({
  disabled = false,
  image,
  src,
  alt,
  variant,
  priority = false,
  className,
}: ImageType) => {
  const resolvedSrc = image?.url || src || undefined

  return (
    <div data-disabled={disabled} className={cn('relative', variantsImage({ variant }), className)}>
      {resolvedSrc && (
        <Image
          src={resolvedSrc}
          alt={image?.alt || alt || 'image'}
          priority={priority}
          sizes="100%"
          fill
          unoptimized={true}
        />
      )}
    </div>
  )
}

export { ImageAtom, variantsImage }
