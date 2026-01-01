import { AppBody } from '@organisms'

import { ChildrenType } from '@types'

export const LayoutDefault = async ({ children }: ChildrenType) => {
  return (
    <html lang="uk" data-scroll-behavior={'smooth'}>
      <AppBody>{children}</AppBody>
    </html>
  )
}
