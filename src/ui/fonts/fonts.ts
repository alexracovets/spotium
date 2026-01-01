import { JetBrains_Mono, Press_Start_2P, Anton } from 'next/font/google'

export const jetbrains_mono = JetBrains_Mono({
  weight: ['500'],
  variable: '--font-jetbrains_mono',
  style: ['normal'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

export const press_start_2p = Press_Start_2P({
  weight: ['400'],
  variable: '--font-press_start',
  style: ['normal'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

export const bebas_neue = Anton({
  weight: ['400'],
  variable: '--font-anton',
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
})
