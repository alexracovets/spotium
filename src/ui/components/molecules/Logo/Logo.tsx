'use client'

import { memo } from 'react'

import { ImageAtom } from '@atoms'

import { Media } from '@payload-types'

type LogoProps = {
  image: Media
}

const Logo = memo(({ image }: LogoProps) => {
  const logoAlt = image?.alt || 'Spotium - головна сторінка'
  return <ImageAtom image={image} alt={logoAlt} variant="logo" />
})

Logo.displayName = 'Logo'

export { Logo }
