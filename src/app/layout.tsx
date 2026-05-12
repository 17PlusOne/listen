import type { Metadata } from 'next'
import './globals.css'
import PreviewBanner from '@/components/PreviewBanner'
import { LocaleProvider } from '@/components/LocaleProvider'

export const metadata: Metadata = {
  title: '听见 Listen · AI 深度访谈工作台',
  description:
    '听见是一个为创作者经济量身打造的 AI 深度访谈工作台。AI 替你和 500 位真实创作者一对一深度对话，规模化拿到第二层、第三层的真实想法。',
  keywords: ['AI 访谈', '创作者经济', '用户研究', '定性研究', 'qualitative research', 'creator economy'],
  authors: [{ name: '听见 Listen Team' }],
  openGraph: {
    title: '听见 Listen · AI 深度访谈工作台',
    description: '让一个研究员，听见五百个创作者。',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-listen-paper text-listen-ink font-sans antialiased">
        <LocaleProvider>
          <PreviewBanner />
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
