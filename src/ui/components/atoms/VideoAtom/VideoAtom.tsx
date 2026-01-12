'use client'

import { cva } from 'class-variance-authority'

import { VideoAtomType } from '@types'

const variantsVideo = cva('', {
  variants: {
    variant: {
      default: 'w-full h-full object-cover rounded-[10px] overflow-hidden',
      cases: 'w-[580px] h-[322px] rounded-[10px] overflow-hidden',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const VideoAtom = ({ video, autoPlay = false, variant = 'default' }: VideoAtomType) => {
  return (
    <video
      src={video.url ?? ''}
      autoPlay={autoPlay}
      muted={true}
      loop={true}
      playsInline={true}
      className={variantsVideo({ variant })}
    />
  )
}

export { VideoAtom, variantsVideo }
