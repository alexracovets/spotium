'use client'

import { useEffect } from 'react'

import { useModel } from '@store'

interface UseSwitchModelProps {
  newModel: number
}

export const useSwitchModel = ({ newModel }: UseSwitchModelProps) => {
  const { activeModel, setActiveModel } = useModel()

  useEffect(() => {
    if (newModel === activeModel) return
    setActiveModel(newModel)
  }, [newModel, activeModel, setActiveModel])

  return null
}
