'use client'

import { cva } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'

import { WrapperType } from '@types'
import { cn } from '@utils'

const variantWrapper = cva('', {
  variants: {
    variant: {
      default: 'w-full',
      container: cn('px-[50px] mx-auto h-fit', 'max-md:px-[24px]', 'max-sm:px-[16px]'),
      page: 'relative h-full',
      app: 'relative grid grid-rows-[auto_1fr_auto] h-[100dvh] bg-base-black antialiased text-base-text max-h-screen h-screen',
      header:
        'py-[4px] relative before:absolute before:content-[" "] before:left-0 before:bottom-0 before:w-full before:h-[1px] before:bg-base-white',
      footer:
        'relative py-[16px] relative before:absolute before:content-[" "] before:left-0 before:top-0 before:w-full before:h-[1px] before:bg-base-white',
      heder_wrapper: 'flex justify-between items-center gap-x-[16px] relative',
      animated_text: cn(
        'flex justify-center items-center gap-[32px] w-full h-full z-[-1]',
        'max-md:gap-[16px]',
      ),
      navigation_button: 'w-[72px] min-w-[72px] h-[72px] min-h-[72px] relative',
      navigation_button_inner:
        'w-[72px] h-[76px] absolute top-[50%] left-0 translate-y-[-50%] flex items-center justify-center',
      localization: 'absolute right-0 top-0 h-full flex items-center justify-center gap-x-[8px]',
      main_page_wrapper: 'flex flex-col justify-center items-start h-full min-h-0 relative',
      page_wrapper: 'flex flex-col justify-start items-start h-full min-h-0 pointer-events-auto',
      page_content: 'flex flex-col justify-start items-start gap-y-[32px]',
      developments_wrapper: cn(
        'w-full max-w-[640px] relative overflow-hidden developments_wrapper_mask min-h-fit',
        'max-sm:max-w-[400px] max-sm:mx-auto',
        'max-xs:max-w-[320px]',
        'max-xxs:max-w-[280px]',
      ),
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
      main_page: cn(
        'flex flex-col justify-center items-start w-full h-full!',
        'max-sm:h-fit! max-sm:justify-start max-sm:gap-y-[32px]',
      ),
      main_content: cn(
        'flex flex-col justify-center items-start py-[32px] gap-y-[32px] w-fit h-full min-h-fit pointer-events-auto',
        'max-xl:gap-y-[16px]',
        'max-sm:justify-start max-sm:mx-auto max-sm:gap-y-[32px]',
      ),
      main_models: cn(
        'absolute top-0 right-0 w-full max-w-[900px] h-full',
        'max-[1500px]:max-w-[600px]',
        'max-[1350px]:max-w-[500px]',
        'max-sm:relative max-sm:max-w-full max-sm:w-full max-sm:h-[80dvw] max-sm:order-1 ',
      ),
      about_content_wrapper: cn(
        'flex flex-col justify-start items-start h-fit min-h-0 pointer-events-auto',
        'gap-y-[24px] py-[8px]',
        'max-sm:py-[16px]',
      ),
      about_content: cn(
        'w-full h-full min-h-fit flex flex-col gap-y-[16px] p-[16px] rounded-[8px]',
        'border border-primary bg-bg-content',
        "max-sm:gap-y-[32px]"
      ),
      about_content_text: 'flex flex-col gap-y-[12px] w-full',
      about_developments: cn(
        'grid grid-cols-3 w-full',
        "max-[650px]:grid-cols-1",
      ),
      about_developments_item: cn(
        'flex justify-start items-center gap-x-[16px] py-[16px]',
        "border-b border-border-destructive nth-last-of-type-3:border-b-0 nth-last-of-type-2:border-b-0 nth-last-of-type-3:border-b-0 nth-last-of-type-1:border-b-0",
        "max-sm:nth-last-of-type-3:border-b max-sm:nth-last-of-type-2:border-b max-sm:nth-last-of-type-1:border-b"
      ),
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
