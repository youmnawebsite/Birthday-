import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import FallingHearts from "@/components/falling-hearts"

export const metadata = {
  title: "يومك في قلبي يحبيبت قلبي ",
  description: "ويبسايت نعيش يومك سوا عليه😍❤",
    generator: 'Mazontk'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <FallingHearts />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'