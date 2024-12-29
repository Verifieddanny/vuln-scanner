import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Web Vulnerability Scanner',
  description: 'Advanced Web Application Security Scanner',
  openGraph: {
    images: "/opengraph-image.png",
  },
  metadataBase: new URL("https://vuln-scanner.vercel.app/"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
