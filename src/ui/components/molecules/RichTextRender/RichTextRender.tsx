'use client'

import { Fragment, type ElementType } from 'react'
import { Page } from '@payload-types'

import { Text, Wrapper, LinkAtom } from '@atoms'

type LexicalRichTextType = NonNullable<Page['main_type_fields']>['title_main']
type LexicalNode = NonNullable<LexicalRichTextType>['root']['children'][number]

interface LexicalTextPart {
  text?: string
  style?: string
  [k: string]: unknown
}

interface LinkNode extends LexicalNode {
  type: 'link'
  children?: LexicalTextPart[]
  fields: {
    url: string
    newTab: boolean
  }
}

interface TextNode extends LexicalNode {
  type: 'paragraph' | 'heading' | 'list'
  children?: LexicalTextPart[]
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  $?: {
    highlight?: 'yellow'
  }
}

const FilterTextPart = (part: LexicalTextPart) => {
  const isHighlight = (part as TextNode).$?.highlight === 'yellow'
  switch (part.type) {
    case 'text':
      return <span className={isHighlight ? 'text-primary' : ''}>{part.text}</span>
    case 'link':
      const link = part as LinkNode
      
      return (
        <LinkAtom
          href={link.fields.url}
          className={isHighlight ? 'text-primary' : ''}
          target={link.fields.newTab ? '_blank' : '_self'}
        >
          {link.children?.map((child: LexicalTextPart, idx: number) => {
            return <Fragment key={idx}>{FilterTextPart(child)}</Fragment>
          })}
        </LinkAtom>
      )
    default:
      return <span className={isHighlight ? 'text-primary' : ''}>{part.text}</span>
  }
}

const FilterText = (text: LexicalNode, variant?: 'main' | 'primary' | 'medium') => {
  switch (text.type) {
    case 'paragraph': {
      const paragraphNode = text as TextNode
      if (!paragraphNode.children) return null
      const Tag: ElementType = 'p'
      return (
        <Text variant={`${variant}_paragraph` as 'main_paragraph'} asChild>
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
        <Text variant={`${variant}_heading` as 'main_heading'} asChild>
          <Tag>
            {headingNode.children.map((part: LexicalTextPart, idx: number) => {
              return <Fragment key={idx}>{FilterTextPart(part)}</Fragment>
            })}
          </Tag>
        </Text>
      )
    }
    case 'list': {
      const listNode = text as TextNode
      const items = listNode.children
      return (
        <Wrapper variant={`${variant}_list` as 'main_list'} asChild>
          <ul>
            {items?.map((text: LexicalTextPart, idx: number) => {
              const parts = text.children as LexicalTextPart[]
              return (
                <Text variant={`${variant}_list_item` as 'main_list_item'} asChild key={idx}>
                  <li>
                    {parts?.map((part: LexicalTextPart, index: number) => {
                      return <Fragment key={index}>{FilterTextPart(part)}</Fragment>
                    })}
                  </li>
                </Text>
              )
            })}
          </ul>
        </Wrapper>
      )
    }
    default:
      return null
  }
}

interface RichTextRenderProps {
  text: LexicalRichTextType
  variant?: 'main' | 'primary' | 'medium'
}

export const RichTextRender = ({ text, variant }: RichTextRenderProps) => {
  if (!text || !text.root) return null
  const textArea = text.root.children

  return (
    <>
      {textArea.map((item: LexicalNode, index: number) => {
        return <Fragment key={index}>{FilterText(item, variant)}</Fragment>
      })}
    </>
  )
}
