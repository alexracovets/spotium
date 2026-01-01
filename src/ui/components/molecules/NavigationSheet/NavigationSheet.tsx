'use client'

import { Sheet, SheetContent, SheetTitle } from '@atoms'
import { NavigationMenu } from '@molecules'
import { useNavigation } from '@store'

const NavigationSheet = () => {
  const { isOpenNavigation, setIsOpenNavigation } = useNavigation()

  return (
    <Sheet open={isOpenNavigation} onOpenChange={setIsOpenNavigation} modal={false}>
      <SheetContent side="right" constrainToMain aria-describedby={undefined}>
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <NavigationMenu />
      </SheetContent>
    </Sheet>
  )
}

export { NavigationSheet }
