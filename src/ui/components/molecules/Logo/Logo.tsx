'use client'

import { ImageAtom } from '@atoms'

import { Media } from '@payload-types'

type LogoProps = {
  image: Media
}

const Logo = ({ image }: LogoProps) => {
  return <ImageAtom image={image} alt="Logo" variant="logo" />
}

export { Logo }
