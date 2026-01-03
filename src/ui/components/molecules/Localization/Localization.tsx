'use client'

import type { LocalizationApp, Media } from '@payload-types'
import { Button, ImageAtom, Text } from '@atoms'

type LocalizationProps = {
  lacales: LocalizationApp['lacales']
}

export const Localization = ({ lacales }: LocalizationProps) => {
  return (
    <div className="absolute right-0 top-0 h-full flex items-center justify-center gap-x-[8px]">
      {lacales?.map((locale) => (
        <Button key={locale.id} variant="locale" size="small">
          <Text variant="locale">{locale.name}</Text>
          <ImageAtom variant="locale" image={locale.image as Media} alt={locale.name || ''} />
        </Button>
      ))}
    </div>
  )
}
