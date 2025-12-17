import type { Metadata } from 'next'
import '../styles/index.css'

export const metadata: Metadata = {
  title: 'Epic Games Store',
  description: 'Responsive UI Design - Epic Games Store Clone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#121212]">
        {children}
      </body>
    </html>
  )
}