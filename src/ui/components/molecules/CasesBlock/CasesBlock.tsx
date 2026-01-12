'use client'

import { Case, Page } from '@payload-types'

import { Wrapper, Text, Separator, VideoAtom, ImageAtom, Button, LinkAtom } from '@atoms'
import { RichTextRender } from '@molecules'
import { cn } from '@/utils'

const getMedia = (image: Case['image']) => {
  return typeof image === 'object' && image !== null ? image : null
}

type CasesBlockProps = {
  items: NonNullable<NonNullable<Page['cases_type_fields']>['elements']>
}

export const CasesBlock = ({ items }: CasesBlockProps) => {
  const caseItems = items.filter((item): item is Case => typeof item === 'object' && item !== null)
  console.log(caseItems)
  return (
    <Wrapper>
      {caseItems.map((item, idx) => {
        const media = getMedia(item.image)
        const mimeType = media?.mimeType
        const isVideo = mimeType?.startsWith('video') ?? false
        return (
          <Wrapper key={item.id ?? idx} className="flex flex-col justify-start items-start w-full">
            <Text className="text-[32px] leading-[2.1]" asChild>
              <h3>{item.name}</h3>
            </Text>
            <Wrapper key={idx} className="grid grid-cols-[1fr_580px] gap-x-[32px]">
              <Wrapper className="flex flex-col justify-start items-start gap-y-[16px]">
                <Separator />
                <Wrapper>
                  <RichTextRender text={item.description} variant="primary" />
                </Wrapper>
                <Wrapper className="flex justify-start items-start flex-wrap gap-[8px]">
                  {item.tags.map((tag) => (
                    <Text
                      key={tag.id}
                      className={cn(
                        'text-[12px] p-[4px] font-jetbrains_mono text-base-white whitespace-nowrap outline outline-[1px] outline-base-white rounded-[100px] px-[16px] py-[4px]',
                        'relative cursor-pointer bg-transparent will-change-transform transform-gpu backface-visibility-hidden',
                        'hover:z-1 hover:scale-[1.1] hover:bg-base-black hover:outline-primary',
                        'transition-all duration-300 ease-in-out',
                      )}
                      asChild
                    >
                      <span>{tag.tag}</span>
                    </Text>
                  ))}
                </Wrapper>
                <LinkAtom href={`/${item.slug}`}>
                  <Button size="normal" arrow>
                    {item.show_button}
                  </Button>
                </LinkAtom>
              </Wrapper>
              <Wrapper>
                {media && isVideo ? (
                  <VideoAtom video={media} autoPlay variant="cases" />
                ) : (
                  media && <ImageAtom image={media} alt={media.alt} variant="cases" />
                )}
              </Wrapper>
            </Wrapper>
          </Wrapper>
        )
      })}
    </Wrapper>
  )
}
