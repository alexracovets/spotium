'use client'

import { useEffect } from 'react'

import { Sheet, SheetContent, SheetTitle } from '@atoms'
import { NavigationMenu } from '@molecules'
import { useNavigation } from '@store'

const NAVIGATION_MENU_ID = 'navigation-menu'

const NavigationSheet = () => {
  const { isOpenNavigation, setIsOpenNavigation } = useNavigation()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenNavigation) {
        setIsOpenNavigation(false)
      }
    }

    if (isOpenNavigation) {
      document.addEventListener('keydown', handleEscape)
      // Блокуємо скрол основного контенту
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpenNavigation, setIsOpenNavigation])

  return (
    <Sheet open={isOpenNavigation} onOpenChange={setIsOpenNavigation} modal={false}>
      <SheetContent
        side="right"
        constrainToMain
        id={NAVIGATION_MENU_ID}
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">Навігація</SheetTitle>
        <NavigationMenu />
      </SheetContent>
    </Sheet>
  )
}

export { NavigationSheet }
