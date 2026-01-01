import { JetBrains_Mono, Bebas_Neue } from 'next/font/google'

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
