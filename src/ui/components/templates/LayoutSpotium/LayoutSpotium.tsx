import { AppHeader, AppFooter } from '@organisms'
import { ChildrenType } from '@types'
import type { Media } from '@payload-types'

type LayoutSpotiumProps = ChildrenType & {
  logo: Media
}

const LayoutSpotium = ({ children, logo }: LayoutSpotiumProps) => {
  return (
    <>
      <AppHeader logo={logo} />
      {children}
      <AppFooter />
    </>
  )
}

export { LayoutSpotium }
