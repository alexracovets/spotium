import { LayoutDefault } from '@templates'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <LayoutDefault>{children}</LayoutDefault>
}
