'use client'

import { useRef, useState } from 'react'

import { Page, Media } from '@payload-types'

import { Container, CustomScroll, Wrapper, Text, Button, LinkAtom, ImageAtom } from '@atoms'
import { useModelsWrapperDimensions, useSwitchModel } from '@hooks'

type ContactsProps = {
  data: Page
}

export const Contacts = ({ data }: ContactsProps) => {
  const [isEmailAnimating, setIsEmailAnimating] = useState(false)
  const emailAnimationTimeout = useRef<NodeJS.Timeout | null>(null)
  useModelsWrapperDimensions()
  useSwitchModel({ newModel: 0 })

  const handleEmailClick = () => {
    if (emailAnimationTimeout.current) {
      clearTimeout(emailAnimationTimeout.current)
    }

    setIsEmailAnimating(true)

    emailAnimationTimeout.current = setTimeout(() => {
      setIsEmailAnimating(false)
    }, 200)
  }

  if (!data.contacts_type_fields) return null

  const { phone_value, under_title, email_copy, phone_name, work_time, socials, button, email } =
    data.contacts_type_fields
  const phoneValueSanitized = phone_value?.replace(/\s+/g, '') || ''

  return (
    <CustomScroll className="h-full">
      <Container>
        <Wrapper className="grid grid-cols-2 gap-x-[16px] h-full col-start-2 py-[64px] ">
          <Wrapper
            variant="page_wrapper"
            className="min-h-0 h-full py-[64px] items-start justify-center gap-y-[16px]"
          >
            <Wrapper className="flex flex-col gap-y-[24px]">
              {under_title && <Text variant="contacts_under_title">{under_title}</Text>}
              <Wrapper className="flex gap-x-[16px]">
                {data.title && (
                  <Text variant="contacts_title" asChild>
                    <h1>{data.title}</h1>
                  </Text>
                )}
                {button && (
                  <Button
                    variant="email"
                    size="email"
                    onClick={handleEmailClick}
                    className={isEmailAnimating ? 'scale-[1.1]' : ''}
                  >
                    {email}
                    <span className="text-base-white">{email_copy}</span>
                  </Button>
                )}
              </Wrapper>
              <ul>
                {work_time?.map((item) => (
                  <li key={item.id} className="grid grid-cols-[100px_1fr] gap-x-[16px]">
                    <Text>{item.name}</Text>
                    <Text>{item.time}</Text>
                  </li>
                ))}
              </ul>
            </Wrapper>
            {phone_value && (
              <Text>
                {phone_name}
                <LinkAtom variant="phone" href={`tel:${phoneValueSanitized}`}>
                  &nbsp;{phone_value}
                </LinkAtom>
              </Text>
            )}
            {socials && (
              <ul className="flex justify-start items-center gap-x-[16px]">
                {socials?.map((item) => {
                  return (
                    <li key={item.id}>
                      <LinkAtom variant="social" href={item.href} target="_blank">
                        <ImageAtom image={item.icon as Media} alt={item.name} variant="social" />
                        {item.name}
                      </LinkAtom>
                    </li>
                  )
                })}
              </ul>
            )}

            {button && (
              <Button size="normal" arrow>
                {button}
              </Button>
            )}
          </Wrapper>
          <Wrapper variant="page_wrapper" id="models_wrapper" />
        </Wrapper>
      </Container>
    </CustomScroll>
  )
}
