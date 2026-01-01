'use client'

import { useState } from 'react'

import { Button, Wrapper } from '@atoms'
import { useNavigation } from '@store'

const NavigationButton = () => {
  const { isOpenNavigation, setIsOpenNavigation } = useNavigation()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Wrapper variant="navigation_button" onClick={() => setIsOpenNavigation(!isOpenNavigation)}>
      <div
        className="w-[72px] h-[72px] absolute top-[50%] left-0 translate-y-[-50%] flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Button
          variant="navigation"
          data-open={isOpenNavigation || isHovered}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation()
            setIsOpenNavigation(!isOpenNavigation)
          }}
        />
      </div>
    </Wrapper>
  )
}

export { NavigationButton }
