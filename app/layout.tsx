import { ReactNode } from 'react'
import '../styles/globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>ATSReady</title>
        <meta name="description" content="ATSReady - Resume Analysis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
