'use client'

import { memo } from 'react'

import { ImageAtom, LinkAtom } from '@atoms'

import { Media } from '@payload-types'

type LogoProps = {
  image: Media
}

const Logo = memo(({ image }: LogoProps) => {
  const logoAlt = image?.alt || 'Spotium - головна сторінка'
  return (
    <LinkAtom href="/">
      <ImageAtom image={image} alt={logoAlt} variant="logo" />
    </LinkAtom>
  )
})

Logo.displayName = 'Logo'

export { Logo }
