'use client'

import { create } from 'zustand'

type ModelStore = {
  activeModel: number 
  setActiveModel: (activeModel: number) => void
  modelsWrapperWidth: number | null
  modelsWrapperHeight: number | null
  modelsWrapperX: number | null
  modelsWrapperY: number | null
  setModelsWrapperDimensions: (width: number, height: number, x: number, y: number) => void
}

export const useModel = create<ModelStore>((set) => ({
  activeModel: 0,
  setActiveModel: (activeModel: number) => {
    setTimeout(() => {
      set({ activeModel: activeModel })
    }, 100)
  },
  modelsWrapperWidth: null,
  modelsWrapperHeight: null,
  modelsWrapperX: null,
  modelsWrapperY: null,
  setModelsWrapperDimensions: (width: number, height: number, x: number, y: number) => {
    set({
      modelsWrapperWidth: width,
      modelsWrapperHeight: height,
      modelsWrapperX: x,
      modelsWrapperY: y,
    })
  },
}))
