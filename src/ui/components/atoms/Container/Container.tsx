'use client'

import { Wrapper } from '@atoms'

import { ChildrenType } from '@types'

type ContainerProps = ChildrenType & {
  asChild?: boolean
}

const Container = ({ children, asChild }: ContainerProps) => {
  return (
    <Wrapper variant="container" asChild>
      <Wrapper asChild={asChild}>{children}</Wrapper>
    </Wrapper>
  )
}

export { Container }
