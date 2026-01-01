import { AppHeader, AppFooter } from '@organisms'
import { ChildrenType } from '@types'

const LayoutSpotium = ({ children }: ChildrenType) => {
  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>
  )
}

export { LayoutSpotium }
