import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import ProcessSection from '@/components/sections/ProcessSection'
import StatsSection from '@/components/sections/StatsSection'
import GallerySection from '@/components/sections/GallerySection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CTASection from '@/components/sections/CTASection'
import MarqueeBar from '@/components/sections/MarqueeBar'
import { getFeaturedProducts, getFeaturedTestimonials, getGalleryItems } from '@/lib/data'

export const metadata: Metadata = {
  title: 'بيكاسو مصر | أقنعة وخوذات كوسبلاي ثلاثية الأبعاد',
  description:
    'بيكاسو مصر — أقنعة وخوذات كوسبلاي مطبوعة ثلاثياً بتشطيب يدوي فاخر. توصيل لكل مصر. 500+ قطعة منجزة.',
}

export default async function HomePage() {
  // Fetch real data from Supabase (with fallback to seed data)
  const [products, testimonials, galleryItems] = await Promise.all([
    getFeaturedProducts(),
    getFeaturedTestimonials(),
    getGalleryItems(9),
  ])

  return (
    <main id="main-content">
      <HeroSection />
      <MarqueeBar />
      <FeaturedProducts products={products} />
      <ProcessSection />
      <StatsSection />
      <GallerySection items={galleryItems} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </main>
  )
}
