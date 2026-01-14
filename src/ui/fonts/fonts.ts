import { JetBrains_Mono, Press_Start_2P, Bebas_Neue, Noto_Sans } from 'next/font/google'

export const jetbrains_mono = JetBrains_Mono({
  weight: ['400', '700', '800'],
  variable: '--font-jetbrains_mono',
  style: ['normal'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: true,
})

export const press_start_2p = Press_Start_2P({
  weight: ['400'],
  variable: '--font-press_start',
  style: ['normal'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: true,
})

export const noto_sans = Noto_Sans({
  weight: ['400', '700', '800', '900'],
  variable: '--font-noto_sans',
  style: ['normal'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: true,
})

export const bebas_neue = Bebas_Neue({
  weight: ['400'],
  variable: '--font-bebas_neue',
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})
