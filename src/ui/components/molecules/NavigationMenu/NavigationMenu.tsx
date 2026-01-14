'use client'

import type { Page, SiteSetting } from '@payload-types'

import { LinkAtom } from '@atoms'

type NavigationMenuProps = {
  navigation: SiteSetting['navigation']
}

export const NavigationMenu = ({ navigation }: NavigationMenuProps) => {
  return (
    <div className="w-[450px] px-[50px] py-[64px]">
      <div className="flex flex-col gap-y-[16px]">
        {navigation?.map((item, idx) => (
          <LinkAtom
            key={idx}
            href={`/${(item as Page).slug as string}`}
            className="text-[38px] text-base-white font-jetbrains_mono uppercase border-b border-base-white"
          >
            {(item as Page).title}
          </LinkAtom>
        ))}
      </div>
    </div>
  )
}
