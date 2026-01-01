'use client'

import { create } from 'zustand'

type NavigationStore = {
  isOpenNavigation: boolean
  setIsOpenNavigation: (isOpenNavigation: boolean) => void
}

export const useNavigation = create<NavigationStore>((set) => ({
  isOpenNavigation: false,
  setIsOpenNavigation: (isOpenNavigation: boolean) => {
    setTimeout(() => {
      set({ isOpenNavigation: isOpenNavigation })
    }, 100)
  },
}))
