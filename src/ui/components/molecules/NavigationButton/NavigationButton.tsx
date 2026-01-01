'use client'

import { useState } from 'react'

import { Button, Wrapper } from '@atoms'
import { cn } from '@/utils'
import { useNavigation } from '@store'

const NavigationButton = () => {
  const { isOpenNavigation, setIsOpenNavigation } = useNavigation()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button variant="navigation" onClick={() => setIsOpenNavigation(!isOpenNavigation)}>
      <div
        className="w-[72px] h-[72px] absolute top-[50%] left-0 translate-y-[-50%] flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Wrapper
          variant="navigation_button"
          data-open={isOpenNavigation || isHovered}
          onClick={(event: React.MouseEvent<HTMLDivElement>) => {
            event.stopPropagation()
            setIsOpenNavigation(!isOpenNavigation)
          }}
        />
      </div>
    </Button>
  )
}

export { NavigationButton }
