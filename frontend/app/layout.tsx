import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from 'sonner';

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'FinanceApp - Quản lý chi tiêu cá nhânnhân',
  description: 'Ứng dụng quản lý thu chi cá nhân - Theo dõi thu chi, quản lý ngân sách hiệu quả',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-bird.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-bird.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon-bird.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        <Toaster></Toaster>
      </body>
    </html>
  )
}
