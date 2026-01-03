'use client'

import { cva } from 'class-variance-authority'
import Image from 'next/image'

import { ImageType } from '@types'
import { cn } from '@/utils'

const variantsImage = cva('', {
  variants: {
    variant: {
      default: 'w-full',
      logo: 'w-[152px] h-[41px]',
      locale: 'w-[22px] h-[16px]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const ImageAtom = ({ image, src, alt, variant, priority = false, className }: ImageType) => {
  const resolvedSrc = image?.url || src || undefined

  return (
    <div className={cn('relative', variantsImage({ variant }), className)}>
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
