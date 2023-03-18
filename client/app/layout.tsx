import './globals.css'
import '@rainbow-me/rainbowkit/styles.css';

export const metadata = {
  title: 'ODCA',
  description: 'Order Dollar Cost Average',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
