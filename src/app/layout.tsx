import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/onesaas-managed/components/Navigation'
import Footer from '@/onesaas-managed/components/Footer'
import { AuthProvider } from '@/onesaas-core/auth/provider'
import { TemplateProvider } from '@/onesaas-core/templates/TemplateProvider'
import { ThemeProvider } from '@/onesaas-core/themes/ThemeProvider'
import { ConditionalLayout } from '@/components/ConditionalLayout'

// SEO 메타데이터 (환경 변수에서 읽음)
const appName = process.env.NEXT_PUBLIC_APP_NAME || 'OneSaaS'
const seoTitle = process.env.NEXT_PUBLIC_SEO_TITLE || appName
const appDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION || '클릭 몇 번으로 완성하는 SaaS'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  title: {
    default: seoTitle,
    template: `%s | ${appName}`,
  },
  description: appDescription,
  keywords: process.env.NEXT_PUBLIC_SEO_KEYWORDS?.split(',') || ['SaaS', '스타트업', '웹서비스'],
  authors: [{ name: process.env.NEXT_PUBLIC_COMPANY_NAME || appName }],
  creator: process.env.NEXT_PUBLIC_COMPANY_NAME || appName,
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteUrl,
    siteName: appName,
    title: seoTitle,
    description: appDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: seoTitle,
    description: appDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" style={{
      colorScheme: 'light',
    }}>
      <body style={{
        background: '#ffffff',
        color: '#1e1b4b',
        fontFamily: "'Pretendard', -apple-system, sans-serif"
      }}>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --color-bg: #ffffff !important;
              --color-bg-secondary: #faf5ff !important;
              --color-text: #1e1b4b !important;
              --color-text-secondary: #6b7280 !important;
              --color-accent: #8b5cf6 !important;
              --color-accent-hover: #7c3aed !important;
              --color-border: #e9d5ff !important;
              --color-success: #22c55e !important;
              --color-warning: #f59e0b !important;
              --color-error: #ef4444 !important;
              --color-info: #3b82f6 !important;
              --font-display: 'Pretendard', -apple-system, sans-serif !important;
              --font-body: 'Pretendard', -apple-system, sans-serif !important;
              --font-mono: 'JetBrains Mono', monospace !important;
              --radius: 8px !important;
              --radius-sm: 4px !important;
              --radius-lg: 16px !important;
              --radius-full: 9999px !important;
            }
          `
        }} />
        <ThemeProvider defaultTheme="startup" defaultMode="light" persistSettings={false}>
          <AuthProvider>
            <TemplateProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </TemplateProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
