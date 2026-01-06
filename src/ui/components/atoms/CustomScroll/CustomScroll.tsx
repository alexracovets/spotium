'use client'

import { OverlayScrollbarsComponent, OverlayScrollbarsComponentRef } from 'overlayscrollbars-react'
import { useRef, useEffect } from 'react'

import { cn } from '@utils'

interface CustomScrollProps {
  children: React.ReactNode
  onScrollStateChange?: (state: { canScrollLeft: boolean; canScrollRight: boolean }) => void
  className?: string
  scrollToElementId?: string | null
  setScrollToElementId?: (id: string | null) => void
}

export const CustomScroll = ({
  children,
  className,
  scrollToElementId,
  setScrollToElementId,
}: CustomScrollProps) => {
  const scrollRef = useRef<OverlayScrollbarsComponentRef<'div'>>(null)

  // Функція для оновлення скролу
  const updateScroll = () => {
    const instance = scrollRef.current?.osInstance()
    if (instance) {
      instance.update(true)
    }
  }

  // Функція для скролу до конкретного елемента
  const scrollToElement = (elementId: string, retryCount = 0) => {
    const osInstance = scrollRef.current?.osInstance()
    if (!osInstance) {
      // Якщо елемент ще не готовий і це не остання спроба - повторюємо
      if (retryCount < 5) {
        setTimeout(() => scrollToElement(elementId, retryCount + 1), 50)
      }
      return
    }

    const viewportElement = osInstance.elements().viewport
    if (!viewportElement) {
      if (retryCount < 5) {
        setTimeout(() => scrollToElement(elementId, retryCount + 1), 50)
      }
      return
    }

    // Знаходимо елемент за data-атрибутом
    const targetElement = viewportElement.querySelector<HTMLElement>(
      `[data-accordion-trigger-id="${elementId}"]`,
    )

    if (!targetElement) {
      // Якщо елемент не знайдено - повторюємо спробу
      if (retryCount < 5) {
        setTimeout(() => scrollToElement(elementId, retryCount + 1), 50)
      }
      return
    }

    // Перевіряємо, чи акордіон розгорнутий (перевіряємо батьківський AccordionItem)
    const accordionItem = targetElement.closest('[data-slot="accordion-item"]')
    const isOpen = accordionItem?.getAttribute('data-state') === 'open'

    // Якщо акордіон ще не розгорнувся, чекаємо трохи довше
    if (!isOpen && retryCount < 5) {
      setTimeout(() => scrollToElement(elementId, retryCount + 1), 100)
      return
    }

    // Використовуємо scrollIntoView для більш точного позиціонування
    // Але спочатку отримуємо поточну позицію для розрахунку
    const elementRect = targetElement.getBoundingClientRect()
    const viewportRect = viewportElement.getBoundingClientRect()
    const currentScrollTop = viewportElement.scrollTop

    // Перевіряємо, чи елемент вже у верхній частині viewport (з невеликим відступом)
    const offsetFromTop = elementRect.top - viewportRect.top
    const tolerance = 5 // Допустима помилка в пікселях

    if (Math.abs(offsetFromTop) > tolerance) {
      // Обчислюємо необхідний скрол, щоб елемент опинився у верхній частині viewport
      const scrollTop = currentScrollTop + offsetFromTop

      // Виконуємо скрол з плавною анімацією
      viewportElement.scrollTo({
        top: Math.max(0, scrollTop), // Переконуємось, що скрол не менше 0
        behavior: 'smooth',
      })

      // Оновлюємо скролбар після скролу
      updateScroll()

      // Перевіряємо позицію після скролу (на випадок, якщо висота змінилася)
      setTimeout(() => {
        const newElementRect = targetElement.getBoundingClientRect()
        const newViewportRect = viewportElement.getBoundingClientRect()
        const newOffsetFromTop = newElementRect.top - newViewportRect.top

        // Якщо позиція все ще не вірна - корегуємо
        if (Math.abs(newOffsetFromTop) > tolerance) {
          const adjustedScrollTop =
            viewportElement.scrollTop + (newElementRect.top - newViewportRect.top)
          viewportElement.scrollTo({
            top: Math.max(0, adjustedScrollTop),
            behavior: 'smooth',
          })
          updateScroll()
        }
      }, 100)
    }
  }

  // Скрол до елемента при зміні scrollToElementId
  useEffect(() => {
    if (!scrollToElementId) return

    // Невелика затримка для забезпечення готовності DOM після відкриття акордіону
    const timeoutId = setTimeout(() => {
      scrollToElement(scrollToElementId)
      setScrollToElementId?.(null)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [scrollToElementId, setScrollToElementId])

  // ResizeObserver для автоматичного оновлення при зміні розміру контенту
  useEffect(() => {
    const osInstance = scrollRef.current?.osInstance()
    if (!osInstance) return

    const viewportElement = osInstance.elements().viewport
    if (!viewportElement) return

    // Знаходимо контент всередині viewport
    const contentElement = viewportElement.firstElementChild as HTMLElement
    if (!contentElement) return

    // Debounce для оптимізації
    let timeoutId: NodeJS.Timeout
    const debouncedUpdate = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        updateScroll()
      }, 50)
    }

    // Відстежуємо зміни розміру контенту
    const observer = new ResizeObserver(debouncedUpdate)
    observer.observe(contentElement)

    // Також відстежуємо зміни розміру viewport
    const viewportObserver = new ResizeObserver(debouncedUpdate)
    viewportObserver.observe(viewportElement)

    return () => {
      observer.disconnect()
      viewportObserver.disconnect()
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    // access scrollable element through keyboard
    const timeoutId = setTimeout(() => {
      const osInstance = scrollRef.current?.osInstance()
      if (osInstance) {
        const viewportElement = osInstance.elements().viewport
        if (viewportElement) {
          viewportElement.setAttribute('tabindex', '0')
        }
      }
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <OverlayScrollbarsComponent
      ref={scrollRef}
      options={{
        scrollbars: {
          theme: 'os-theme-custom',
          clickScroll: false,
          autoHide: 'never',
        },
      }}
      className={cn('h-full w-full', className)}
    >
      {children}
    </OverlayScrollbarsComponent>
  )
}
