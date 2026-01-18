'use client'

import { Wrapper } from '@atoms'

import { ChildrenType } from '@types'
import { cn } from '@utils'

type ContainerProps = ChildrenType & {
  asChild?: boolean
  className?: string
}

const Container = ({ children, asChild, className }: ContainerProps) => {
  return (
    <Wrapper variant="container" className={cn(className, 'content_wrapper_mask')} asChild>
      <Wrapper className="h-fit min-h-0" asChild={asChild}>
        {children}
      </Wrapper>
    </Wrapper>
  )
}

export { Container }
