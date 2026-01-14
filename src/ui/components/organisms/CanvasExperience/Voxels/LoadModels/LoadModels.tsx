'use client'

import { useCallback, useRef, useEffect } from 'react'
import { Dispatch, SetStateAction } from 'react'

import { Vector3 } from 'three'

type VoxelPreparedItem = {
  position: Vector3
}

type VoxelRawItem = {
  position: {
    x: number
    y: number
    z: number
  }
}

const MODEL_LOADERS = [
  () => import('../data/logo.json'),
  () => import('../data/about.json'),
  () => import('../data/services.json'),
]

const INITIAL_MODELS_STATE = MODEL_LOADERS.map(() => null) as (VoxelPreparedItem[] | null)[]

interface LoadModelsProps {
  modelsData: (VoxelPreparedItem[] | null)[] | null
  setModelsData: Dispatch<SetStateAction<(VoxelPreparedItem[] | null)[] | null>>
}

export const LoadModels = ({ setModelsData, modelsData }: LoadModelsProps) => {
  const cachedModelsRef = useRef<(VoxelPreparedItem[] | null)[]>(
    modelsData ?? [...INITIAL_MODELS_STATE],
  )

  const loadModelData = useCallback(
    async (modelIdx: number) => {
      if (cachedModelsRef.current?.[modelIdx]) return cachedModelsRef.current?.[modelIdx]

      const { default: rawData = [] } = ((await MODEL_LOADERS[modelIdx]?.()) ?? {}) as {
        default?: VoxelRawItem[]
      }

      const prepared = rawData.map((item) => ({
        position: new Vector3(item.position.x, item.position.y, item.position.z),
      }))

      cachedModelsRef.current[modelIdx] = prepared
      setModelsData((prev) => {
        const base = prev ?? [...INITIAL_MODELS_STATE]
        const next = [...base]
        next[modelIdx] = prepared
        return next
      })

      return null
    },
    [setModelsData],
  )

  useEffect(() => {
    const current = modelsData ?? cachedModelsRef.current
    if (current.every((model) => model !== null)) return
    for (let i = 0; i < MODEL_LOADERS.length; i++) {
      loadModelData(i)
    }
  }, [loadModelData, modelsData])

  useEffect(() => {
    if (modelsData && modelsData !== cachedModelsRef.current) {
      cachedModelsRef.current = modelsData
    }
  }, [modelsData])

  return null
}
