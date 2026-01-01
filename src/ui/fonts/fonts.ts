import { JetBrains_Mono, Bebas_Neue, Press_Start_2P } from 'next/font/google'

export const bebas_neue = Bebas_Neue({
  weight: ['400'],
  variable: '--font-bebas_neue',
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
})

export const jetbrains_mono = JetBrains_Mono({
  weight: ['500'],
  variable: '--font-jetbrains_mono',
  style: ['normal'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

export const press_start_2p = Press_Start_2P({
  weight: ['400'],
  variable: '--font-press_start_2p',
  style: ['normal'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})
