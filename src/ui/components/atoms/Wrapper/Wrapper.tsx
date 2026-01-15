'use client'

import { cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'

import { WrapperType } from '@types'
import { cn } from '@utils'

const variantWrapper = cva('', {
  variants: {
    variant: {
      default: 'w-full',
      container: 'px-[50px] mx-auto h-full',
      app: 'relative grid grid-rows-[auto_1fr_auto] h-[100dvh] bg-base-black antialiased text-base-text max-h-screen h-screen',
      header:
        'py-[4px] relative before:absolute before:content-[" "] before:left-0 before:bottom-0 before:w-full before:h-[1px] before:bg-base-white',
      footer:
        'relative py-[16px] relative before:absolute before:content-[" "] before:left-0 before:top-0 before:w-full before:h-[1px] before:bg-base-white',
      heder_wrapper: 'flex justify-between items-center gap-x-[16px] relative',
      animated_text:
        'flex justify-center items-center gap-[32px] absolute top-0 left-0 w-full h-full z-[-1]',
      navigation_button: 'w-[72px] min-w-[72px] h-[72px] min-h-[72px] relative',
      navigation_button_inner:
        'w-[72px] h-[76px] absolute top-[50%] left-0 translate-y-[-50%] flex items-center justify-center',
      localization: 'absolute right-0 top-0 h-full flex items-center justify-center gap-x-[8px]',
      main_page_wrapper: 'flex flex-col justify-center items-start',
      page_wrapper: 'flex flex-col justify-start items-start gap-y-[32px] pointer-events-auto',
      page_content: 'flex flex-col justify-start items-start gap-y-[32px]',
      developments_wrapper:
        'w-full max-w-[640px] relative overflow-hidden developments_wrapper_mask min-h-fit',
      developments: 'flex justify-center items-center gap-x-[20px] px-[10px]',
      development_item: 'flex justify-center items-center gap-x-[16px]',
      column: 'flex flex-col justify-start items-start gap-y-[16px]',
      canvas_experience: 'absolute top-0 left-0 w-full h-full z-[-1]',
      primary_list: 'flex flex-col justify-start items-start gap-y-[4px]',
      main_list: 'flex flex-col justify-start items-start',
      case_grid: 'grid grid-cols-[1fr_580px] gap-x-[32px] w-full',
      tags: 'flex justify-start items-start flex-wrap gap-[8px]',
      rich_text_wrapper: 'flex flex-col justify-start items-start gap-y-[8px] py-[16px]',
      tab_wrapper: 'flex flex-col justify-start items-start gap-y-[8px]',
      main_wrapper: 'grid grid-cols-2 gap-x-[16px] h-full col-start-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const Wrapper = ({
  children,
  variant = 'default',
  className,
  asChild = false,
  style,
  ...props
}: WrapperType) => {
  const Component = asChild ? Slot : 'div'

  return (
    <Component className={cn(variantWrapper({ variant, className }))} {...props} style={style}>
      {children}
    </Component>
  )
}

export { Wrapper, variantWrapper }
