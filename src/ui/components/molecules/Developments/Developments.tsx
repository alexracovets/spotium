'use client'

import { ImageAtom, Text, Wrapper } from '@atoms'
import Marquee from 'react-fast-marquee'

import type { Media, Page } from '@payload-types'

interface DevelopmentsProps {
  developments: NonNullable<Page['main_type_fields']>['developments']
}

export const Developments = ({ developments }: DevelopmentsProps) => {
  if (!developments) return null

  return (
    <div className="relative max-sm:mx-auto w-full max-sm:order-5">
      <Wrapper variant="developments_wrapper">
        <Marquee autoFill className="overflow-hidden">
          <Wrapper variant="developments">
            {developments.map((item) => {
              return (
                <Wrapper key={item.id} variant="development_item">
                  <ImageAtom
                    image={item.image as Media}
                    alt={(item.image as Media)?.alt || ''}
                    variant="development"
                  />
                  {item.captions && (
                    <Wrapper variant="column" className="gap-y-0">
                      {item.captions.map((caption) => {
                        return (
                          <Text key={caption.id} variant="development">
                            {caption.text}
                          </Text>
                        )
                      })}
                    </Wrapper>
                  )}
                </Wrapper>
              )
            })}
          </Wrapper>
        </Marquee>
      </Wrapper>
    </div>
  )
}
