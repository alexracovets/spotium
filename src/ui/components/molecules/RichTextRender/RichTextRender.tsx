'use client'

import { Fragment, type ElementType } from 'react'

import { Page } from '@payload-types'
import { Text, variantText } from '@atoms'
import { VariantProps } from 'class-variance-authority'

type LexicalRichTextType = NonNullable<Page['main_type_fields']>['title']
type LexicalNode = NonNullable<LexicalRichTextType>['root']['children'][number]

interface LexicalTextPart {
  text?: string
  style?: string
  [k: string]: unknown
}

interface TextNode extends LexicalNode {
  type: 'paragraph' | 'heading'
  children?: LexicalTextPart[]
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  $?: {
    highlight?: 'yellow'
  }
}

const FilterTextPart = (part: LexicalTextPart) => {
  const isHighlight = (part as TextNode).$?.highlight === 'yellow'
  return <span className={isHighlight ? 'text-primary' : ''}>{part.text}</span>
}

const FilterText = (text: LexicalNode, variant?: VariantProps<typeof variantText>['variant']) => {
  switch (text.type) {
    case 'paragraph': {
      const paragraphNode = text as TextNode
      if (!paragraphNode.children) return null
      const Tag: ElementType = 'p'
      return (
        <Text variant={variant} asChild>
          <Tag>
            {paragraphNode.children.map((part: LexicalTextPart, idx: number) => {
              return <Fragment key={idx}>{FilterTextPart(part)}</Fragment>
            })}
          </Tag>
        </Text>
      )
    }
    case 'heading': {
      const headingNode = text as TextNode
      if (!headingNode.children) return null
      const tag = headingNode.tag || 'h1'
      const Tag: ElementType = tag

      return (
        <Text variant={variant} asChild>
          <Tag>
            {headingNode.children.map((part: LexicalTextPart, idx: number) => {
              return <Fragment key={idx}>{FilterTextPart(part)}</Fragment>
            })}
          </Tag>
        </Text>
      )
    }
    default:
      return null
  }
}

export const RichTextRender = ({
  text,
  variant,
}: {
  text: LexicalRichTextType
  variant?: string
}) => {
  if (!text || !text.root) return null
  const textArea = text.root.children

  return (
    <>
      {textArea.map((item: LexicalNode, index: number) => {
        return (
          <Fragment key={index}>
            {FilterText(item, variant as VariantProps<typeof variantText>['variant'])}
          </Fragment>
        )
      })}
    </>
  )
}
