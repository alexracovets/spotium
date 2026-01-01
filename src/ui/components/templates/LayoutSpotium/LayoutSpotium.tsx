import { AppHeader, AppFooter } from '@organisms'
import { ChildrenType } from '@types'
import type { Media, SiteSetting } from '@payload-types'

type LayoutSpotiumProps = ChildrenType & {
  logo: Media
  animatedTexts?: SiteSetting['animatedTexts']
}

const LayoutSpotium = ({ children, logo, animatedTexts }: LayoutSpotiumProps) => {
  return (
    <>
      <AppHeader logo={logo} animatedTexts={animatedTexts} />
      {children}
      <AppFooter />
    </>
  )
}

export { LayoutSpotium }
