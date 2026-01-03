import { JetBrains_Mono, Press_Start_2P, Anton, Bebas_Neue } from 'next/font/google'

export const jetbrains_mono = JetBrains_Mono({
  weight: ['400', '700'],
  variable: '--font-jetbrains_mono',
  style: ['normal'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: false,
})

export const press_start_2p = Press_Start_2P({
  weight: ['400'],
  variable: '--font-press_start',
  style: ['normal'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  preload: false,
})

export const anton = Anton({
  weight: ['400'],
  variable: '--font-anton',
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
})

export const bebas_neue = Bebas_Neue({
  weight: ['400'],
  variable: '--font-bebas_neue',
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
})
