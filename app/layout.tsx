import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Breeze Trading App',
  description: 'Created by vj',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
