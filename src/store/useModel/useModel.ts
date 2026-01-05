'use client'

import { create } from 'zustand'

type ModelStore = {
  activeModel: number
  setActiveModel: (activeModel: number) => void
}

export const useModel = create<ModelStore>((set) => ({
  activeModel: 0,
  setActiveModel: (activeModel: number) => {
    setTimeout(() => {
      set({ activeModel: activeModel })
    }, 100)
  },
}))
