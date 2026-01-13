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

  return (
    <Wrapper>
      {caseItems.map((item, idx) => {
        const media = getMedia(item.image)
        const mimeType = media?.mimeType
        const isVideo = mimeType?.startsWith('video') ?? false
        return (
          <Wrapper key={item.id ?? idx} variant="column">
            <Text variant="case_name" asChild>
              <h3>{item.name}</h3>
            </Text>
            <Wrapper variant="case_grid">
              <Wrapper variant="column">
                <Separator />
                <Wrapper>
                  <RichTextRender text={item.description} variant="primary" />
                </Wrapper>
                <Wrapper variant="tags">
                  {item.tags.map((tag) => (
                    <Text key={tag.id} variant="tag" asChild>
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
      {caseItems.map((item, idx) => {
        const media = getMedia(item.image)
        const mimeType = media?.mimeType
        const isVideo = mimeType?.startsWith('video') ?? false
        return (
          <Wrapper key={item.id ?? idx} variant="column">
            <Text variant="case_name" asChild>
              <h3>{item.name}</h3>
            </Text>
            <Wrapper variant="case_grid">
              <Wrapper variant="column">
                <Separator />
                <Wrapper>
                  <RichTextRender text={item.description} variant="primary" />
                </Wrapper>
                <Wrapper variant="tags">
                  {item.tags.map((tag) => (
                    <Text key={tag.id} variant="tag" asChild>
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
      {caseItems.map((item, idx) => {
        const media = getMedia(item.image)
        const mimeType = media?.mimeType
        const isVideo = mimeType?.startsWith('video') ?? false
        return (
          <Wrapper key={item.id ?? idx} variant="column">
            <Text variant="case_name" asChild>
              <h3>{item.name}</h3>
            </Text>
            <Wrapper variant="case_grid">
              <Wrapper variant="column">
                <Separator />
                <Wrapper>
                  <RichTextRender text={item.description} variant="primary" />
                </Wrapper>
                <Wrapper variant="tags">
                  {item.tags.map((tag) => (
                    <Text key={tag.id} variant="tag" asChild>
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
      {caseItems.map((item, idx) => {
        const media = getMedia(item.image)
        const mimeType = media?.mimeType
        const isVideo = mimeType?.startsWith('video') ?? false
        return (
          <Wrapper key={item.id ?? idx} variant="column">
            <Text variant="case_name" asChild>
              <h3>{item.name}</h3>
            </Text>
            <Wrapper variant="case_grid">
              <Wrapper variant="column">
                <Separator />
                <Wrapper>
                  <RichTextRender text={item.description} variant="primary" />
                </Wrapper>
                <Wrapper variant="tags">
                  {item.tags.map((tag) => (
                    <Text key={tag.id} variant="tag" asChild>
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
      {caseItems.map((item, idx) => {
        const media = getMedia(item.image)
        const mimeType = media?.mimeType
        const isVideo = mimeType?.startsWith('video') ?? false
        return (
          <Wrapper key={item.id ?? idx} variant="column">
            <Text variant="case_name" asChild>
              <h3>{item.name}</h3>
            </Text>
            <Wrapper variant="case_grid">
              <Wrapper variant="column">
                <Separator />
                <Wrapper>
                  <RichTextRender text={item.description} variant="primary" />
                </Wrapper>
                <Wrapper variant="tags">
                  {item.tags.map((tag) => (
                    <Text key={tag.id} variant="tag" asChild>
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
      {caseItems.map((item, idx) => {
        const media = getMedia(item.image)
        const mimeType = media?.mimeType
        const isVideo = mimeType?.startsWith('video') ?? false
        return (
          <Wrapper key={item.id ?? idx} variant="column">
            <Text variant="case_name" asChild>
              <h3>{item.name}</h3>
            </Text>
            <Wrapper variant="case_grid">
              <Wrapper variant="column">
                <Separator />
                <Wrapper>
                  <RichTextRender text={item.description} variant="primary" />
                </Wrapper>
                <Wrapper variant="tags">
                  {item.tags.map((tag) => (
                    <Text key={tag.id} variant="tag" asChild>
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
      {caseItems.map((item, idx) => {
        const media = getMedia(item.image)
        const mimeType = media?.mimeType
        const isVideo = mimeType?.startsWith('video') ?? false
        return (
          <Wrapper key={item.id ?? idx} variant="column">
            <Text variant="case_name" asChild>
              <h3>{item.name}</h3>
            </Text>
            <Wrapper variant="case_grid">
              <Wrapper variant="column">
                <Separator />
                <Wrapper>
                  <RichTextRender text={item.description} variant="primary" />
                </Wrapper>
                <Wrapper variant="tags">
                  {item.tags.map((tag) => (
                    <Text key={tag.id} variant="tag" asChild>
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
