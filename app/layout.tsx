import type { Metadata } from 'next'
import { Cinzel_Decorative, Cormorant_Garamond, Cairo } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from '@/components/providers/LanguageProvider'
import CustomCursor from '@/components/ui/CustomCursor'
import LoadingScreen from '@/components/ui/LoadingScreen'

const cinzel = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cinzel',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'بيكاسو مصر | أقنعة وخوذات كوسبلاي ثلاثية الأبعاد',
    template: '%s | بيكاسو مصر',
  },
  description:
    'بيكاسو مصر — أقنعة وخوذات كوسبلاي مطبوعة ثلاثياً بتشطيب يدوي فاخر. توصيل لكل مصر. 500+ قطعة منجزة. اطلب دلوقتي على واتساب.',
  keywords: [
    'بيكاسو مصر',
    'كوسبلاي مصر',
    'أقنعة كوسبلاي',
    'خوذات 3D',
    'طباعة ثلاثية الأبعاد مصر',
    'cosplay Egypt',
    '3D printed masks',
    'Picasso Masr',
  ],
  openGraph: {
    title: 'بيكاسو مصر | Picasso Masr',
    description: 'Premium 3D Printed Cosplay Masks & Helmets — Handcrafted in Egypt',
    url: 'https://picassomasr.com',
    siteName: 'بيكاسو مصر',
    locale: 'ar_EG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'بيكاسو مصر | Picasso Masr',
    description: 'Premium 3D Printed Cosplay Masks & Helmets — Handcrafted in Egypt',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'بيكاسو مصر',
      alternateName: 'Picasso Masr',
      description: 'أقنعة وخوذات كوسبلاي مطبوعة بالـ 3D وتشطيب يدوي فاخر',
      url: 'https://picassomasr.com',
      telephone: '+201000000000',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'EG',
      },
      sameAs: [
        'https://instagram.com/picassomasr',
        'https://facebook.com/picassomasr',
      ],
    }),
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cinzel.variable} ${cormorant.variable} ${cairo.variable}`}
    >
      <body className="font-ar bg-bg-void text-text-cream">
        <LanguageProvider>
          <LoadingScreen />
          <CustomCursor />
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#1A1A1A',
                color: '#F0E6D3',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '8px',
                fontFamily: 'Cairo, sans-serif',
              },
              success: {
                iconTheme: { primary: '#C9A84C', secondary: '#050505' },
              },
              error: {
                iconTheme: { primary: '#E57373', secondary: '#050505' },
              },
            }}
          />
        </LanguageProvider>
      </body>
    </html>
  )
}
