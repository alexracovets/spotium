'use client'

import { useState } from 'react'

import { Button, Text, Wrapper } from '@atoms'
import { useNavigation } from '@store'
import { cn } from '@/utils'

const NavigationButton = () => {
  const { isOpenNavigation, setIsOpenNavigation } = useNavigation()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="cursor-pointer">
      <Button
        variant="navigation"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsOpenNavigation(true)}
        onClick={() => setIsOpenNavigation(true)}
        onBlur={() => setIsHovered(false)}
        disabled={isOpenNavigation}
        aria-label={isOpenNavigation ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpenNavigation}
        aria-controls="navigation-menu"
        aria-haspopup="dialog"
      >
        <div className="relative">
          <Text variant="navigation_button" className="opacity-0">
            Close
          </Text>
          <Text
            variant="navigation_button"
            data-active={isOpenNavigation || isHovered}
            className="absolute top-0 right-0"
          >
            {isOpenNavigation ? 'Close' : 'Menu'}
          </Text>
        </div>

        <Wrapper variant="navigation_button">
          <Wrapper variant="navigation_button_inner">
            <div
              data-open={isOpenNavigation || isHovered}
              className={cn(
                'w-[72px] h-[48px] bg-base-white rounded-full relative',
                "before:content-[''] before:absolute before:top-[50%] before:left-[20px] before:translate-x-[-50%] before:translate-y-[-50%] before:w-[10px] before:h-[10px] before:bg-base-black before:rounded-full before:transition-all before:duration-300 before:ease-in-out",
                "after:content-[''] after:absolute after:bottom-[50%] after:right-[20px] after:translate-x-[50%] after:translate-y-[50%] after:w-[10px] after:h-[10px] after:bg-base-black after:rounded-full after:transition-all after:duration-300 after:ease-in-out",
                'transition-all duration-300 ease-in-out',
                'focus-visible:w-[48px] focus-visible:h-[72px] focus-visible:after:bottom-[20px] focus-visible:after:right-[50%] focus-visible:before:top-[20px] focus-visible:before:left-[50%] focus-visible:before:w-[20px] focus-visible:before:h-[20px]',
                '[&[data-open="true"]]:w-[48px] [&[data-open="true"]]:h-[72px] [&[data-open="true"]]:after:bottom-[20px] [&[data-open="true"]]:after:right-[50%] [&[data-open="true"]]:before:top-[20px] [&[data-open="true"]]:before:left-[50%] [&[data-open="true"]]:before:w-[24px] [&[data-open="true"]]:before:h-[24px] [&[data-open="true"]]:shadow-[0px_0px_2px_white] [&[data-open="true"]]:outline-primary',
                "data-[open='true']:outline data-[open='true']:outline-primary data-[open='true']:outline-width-2 ",
              )}
            />
          </Wrapper>
        </Wrapper>
      </Button>
    </div>
  )
}

export { NavigationButton }
