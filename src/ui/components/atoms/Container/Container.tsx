'use client'

import { Wrapper } from '@atoms'

import { ChildrenType } from '@types'

type ContainerProps = ChildrenType & {
  asChild?: boolean
  className?: string
}

const Container = ({ children, asChild, className }: ContainerProps) => {
  return (
    <Wrapper variant="container" className={className} asChild>
      <Wrapper className="h-full min-h-0" asChild={asChild}>
        {children}
      </Wrapper>
    </Wrapper>
  )
}

export { Container }
