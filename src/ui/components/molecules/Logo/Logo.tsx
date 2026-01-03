'use client'

import { ImageAtom } from '@atoms'

import { Media } from '@payload-types'

type LogoProps = {
  image: Media
}

const Logo = ({ image }: LogoProps) => {
  const logoAlt = image?.alt || 'Spotium - головна сторінка'
  return <ImageAtom image={image} alt={logoAlt} variant="logo" />
}

export { Logo }
