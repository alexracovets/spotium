'use client'

import { Case } from '@payload-types'
import { Wrapper, Text, Tabs, TabsList, TabsTrigger, TabsContent, Separator } from '@atoms'
import { RichTextRender } from '@molecules'

type CaseTabs = NonNullable<NonNullable<Case['tabs']>>
type TabKey = keyof CaseTabs
type TabData = CaseTabs[TabKey]

type CasesTabsProps = {
  items: CaseTabs
}

const hasDescription = (
  tab: TabData,
): tab is TabData & { description: CaseTabs['info_tab']['description'] } =>
  typeof tab === 'object' && tab !== null && 'description' in tab

const hasElements = (
  tab: TabData,
): tab is TabData & { elements: NonNullable<CaseTabs['qa_tab']['elements']> } =>
  typeof tab === 'object' && tab !== null && 'elements' in tab

export const CasesTabs = ({ items }: CasesTabsProps) => {
  const tabs =
    items && Object.keys(items).length > 0
      ? (Object.keys(items) as TabKey[])
          .map((key) => ({
            value: key,
            data: items[key],
          }))
          .filter((tab): tab is { value: TabKey; data: TabData } => Boolean(tab.data))
      : []
  return (
    <Wrapper>
      <Tabs defaultValue={tabs[0]?.value}>
        <TabsList>
          {tabs.map(({ value, data }, idx) => (
            <TabsTrigger key={idx} value={value}>
              {data?.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <Separator />
        {tabs.map(({ value, data }) => (
          <TabsContent key={value} value={value}>
            <Wrapper variant="tab_wrapper" className="py-[16px]">
              {hasDescription(data) && data.description && (
                <RichTextRender text={data.description} variant="primary" />
              )}
              {hasElements(data) && data.elements && data.elements.length > 0 && (
                <Wrapper variant="tab_wrapper">
                  {data.elements.map((element, idx) => (
                    <Wrapper key={element.id ?? idx}>
                      <Text variant="primary_paragraph">{element.question}</Text>
                      <RichTextRender text={element.answer} variant="primary" />
                    </Wrapper>
                  ))}
                </Wrapper>
              )}
            </Wrapper>
          </TabsContent>
        ))}
      </Tabs>
    </Wrapper>
  )
}
