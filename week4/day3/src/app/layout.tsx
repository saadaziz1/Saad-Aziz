import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import '../styles/index.css'

export const metadata: Metadata = {
  title: 'Epic Games Store',
  description: 'Responsive UI Design - Epic Games Store Clone',
}

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap', // Ensures the fallback font is used while Poppins loads, preventing layout shift
  variable: '--font-poppins', // Assigns a CSS variable name for use in CSS/Tailwind
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] // Specify the weights you need
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} min-h-screen bg-[#121212]`}>
        {children}
      </body>
    </html>
  )
}