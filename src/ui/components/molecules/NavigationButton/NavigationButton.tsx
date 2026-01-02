'use client'

import { useState } from 'react'

import { Button, Text, Wrapper } from '@atoms'
import { useNavigation } from '@store'
import { cn } from '@/utils'

const NavigationButton = () => {
  const { isOpenNavigation, setIsOpenNavigation } = useNavigation()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="cursor-pointer outline-none">
      <Button
        variant="navigation"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpenNavigation(true)}
        disabled={isOpenNavigation}
      >
        <Text variant="navigation_button" data-active={isOpenNavigation || isHovered}>
          {isOpenNavigation ? 'Close' : 'Menu'}
        </Text>
        <Wrapper variant="navigation_button">
          <Wrapper variant="navigation_button_inner">
            <div
              className={cn(
                'w-[72px] h-[48px] bg-base-white rounded-full relative',
                "before:content-[''] before:absolute before:top-[50%] before:left-[20px] before:translate-x-[-50%] before:translate-y-[-50%] before:w-[10px] before:h-[10px] before:bg-base-black before:rounded-full before:transition-all before:duration-300 before:ease-in-out",
                "after:content-[''] after:absolute after:bottom-[50%] after:right-[20px] after:translate-x-[50%] after:translate-y-[50%] after:w-[10px] after:h-[10px] after:bg-base-black after:rounded-full after:transition-all after:duration-300 after:ease-in-out",
                'transition-all duration-300 ease-in-out',
                'focus-visible:w-[48px] focus-visible:h-[72px] focus-visible:after:bottom-[20px] focus-visible:after:right-[50%] focus-visible:before:top-[20px] focus-visible:before:left-[50%] focus-visible:before:w-[20px] focus-visible:before:h-[20px]',
                '[&[data-open="true"]]:w-[48px] [&[data-open="true"]]:h-[72px] [&[data-open="true"]]:after:bottom-[20px] [&[data-open="true"]]:after:right-[50%] [&[data-open="true"]]:before:top-[20px] [&[data-open="true"]]:before:left-[50%] [&[data-open="true"]]:before:w-[24px] [&[data-open="true"]]:before:h-[24px] [&[data-open="true"]]:shadow-[0px_0px_6px_white] [&[data-open="true"]]:outline-primary',
              )}
              data-open={isOpenNavigation || isHovered}
            />
          </Wrapper>
        </Wrapper>
      </Button>
    </div>
  )
}

export { NavigationButton }
