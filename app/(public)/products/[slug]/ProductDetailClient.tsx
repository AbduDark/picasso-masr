'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Shield, Zap, Eye, Truck, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { getProductWhatsAppUrl } from '@/lib/whatsapp'
import { formatPrice, getProductPlaceholder } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import GoldDivider from '@/components/ui/GoldDivider'
import type { DBProduct } from '@/lib/data'

interface Props {
  product: DBProduct
  relatedProducts: DBProduct[]
}

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const { isArabic, t, lang } = useLanguage()
  
  // Use real images if available, otherwise placeholders
  const productImages = (product.images && product.images.length > 0) ? product.images : [
    product.thumbnail || getProductPlaceholder(0),
    getProductPlaceholder(1),
    getProductPlaceholder(2),
    getProductPlaceholder(3),
  ]

  const [activeImage, setActiveImage] = useState(0)
  const [specsOpen, setSpecsOpen] = useState(false)

  const whatsappUrl = getProductWhatsAppUrl(
    isArabic ? product.name_ar : (product.name_en ?? product.name_ar),
    lang as 'ar' | 'en',
  )

  const specs = [
    { label_ar: 'المادة',        label_en: 'Material',    value: product.material || 'Resin Premium' },
    { label_ar: 'التشطيب',      label_en: 'Finish',      value: product.finish || 'Hand-painted & sealed' },
    { label_ar: 'الفئة',        label_en: 'Category',    value: isArabic ? ({ helmet: 'خوذة', mask: 'قناع', armor: 'درع', custom: 'مخصص' }[product.category] || product.category) : product.category },
    { label_ar: 'قابل للارتداء', label_en: 'Wearable',   value: product.is_wearable ? (isArabic ? 'نعم' : 'Yes') : (isArabic ? 'لا' : 'No') },
    { label_ar: 'LED مدمج',     label_en: 'LED Built-in', value: product.has_led ? (isArabic ? 'نعم' : 'Yes') : (isArabic ? 'لا' : 'No') },
  ]

  return (
    <main className="min-h-screen bg-bg-void">
      {/* Breadcrumb */}
      <div className="pt-28 pb-4 container-custom">
        <nav className="flex items-center gap-2 text-xs text-text-muted font-ar" aria-label="مسار التنقل">
          <Link href="/" className="hover:text-gold-pure transition-colors">{isArabic ? 'الرئيسية' : 'Home'}</Link>
          <ChevronLeft size={12} />
          <Link href="/products" className="hover:text-gold-pure transition-colors">{isArabic ? 'أعمالنا' : 'Our Work'}</Link>
          <ChevronLeft size={12} />
          <span className="text-text-secondary">{isArabic ? product.name_ar : (product.name_en ?? product.name_ar)}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <section className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Left — Gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gold/20 img-zoom-container"
            >
              <Image
                src={productImages[activeImage] || productImages[0]}
                alt={`${isArabic ? product.name_ar : (product.name_en ?? product.name_ar)} — صورة ${activeImage + 1}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Navigation arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage(i => (i - 1 + productImages.length) % productImages.length)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 w-9 h-9 rounded-full bg-bg-void/70 border border-gold/20 flex items-center justify-center text-gold-pure hover:bg-gold-pure/20 transition-colors cursor-pointer"
                    aria-label="الصورة السابقة"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    onClick={() => setActiveImage(i => (i + 1) % productImages.length)}
                    className="absolute top-1/2 left-3 -translate-y-1/2 w-9 h-9 rounded-full bg-bg-void/70 border border-gold/20 flex items-center justify-center text-gold-pure hover:bg-gold-pure/20 transition-colors cursor-pointer"
                    aria-label="الصورة التالية"
                  >
                    <ChevronLeft size={16} />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {productImages.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                    activeImage === i ? 'border-gold-pure' : 'border-transparent hover:border-gold/40'
                  }`}
                  aria-label={`عرض الصورة ${i + 1}`}
                  aria-pressed={activeImage === i}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Details */}
          <div className="flex flex-col gap-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.is_new && <Badge variant="gold">{t('products.badge_new')}</Badge>}
              {product.has_led && <Badge variant="blue">{t('products.badge_led')}</Badge>}
              {product.category === 'custom' && <Badge variant="silver">{t('products.badge_custom')}</Badge>}
              {product.franchise && (
                <Badge variant="silver">{product.franchise}</Badge>
              )}
            </div>

            {/* Name */}
            <div>
              <h1 className="font-ar font-black text-text-cream leading-tight mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
                {isArabic ? product.name_ar : (product.name_en ?? product.name_ar)}
              </h1>
              {isArabic && product.name_en && (
                <p className="font-body-en text-text-muted text-lg italic">{product.name_en}</p>
              )}
            </div>

            <GoldDivider variant="line" className="my-0" />

            {/* Price */}
            <div>
              <p className="text-xs text-text-muted font-ar mb-1">{isArabic ? 'السعر يبدأ من' : 'Starting from'}</p>
              <p className="font-ar font-black text-gold-pure" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.2rem)' }}>
                {product.price
                  ? formatPrice(product.price, lang as 'ar' | 'en')
                  : (isArabic ? (product.price_label_ar ?? 'تواصل للسعر') : (product.price_label_en ?? 'Contact us'))}
              </p>
            </div>

            {/* Description */}
            <div className="prose-luxury">
              <p className="font-ar text-text-secondary leading-loose">
                {isArabic ? product.description_ar : (product.description_en ?? product.description_ar)}
              </p>
            </div>

            {/* Quick specs icons */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield,      text: isArabic ? 'جودة مضمونة' : 'Quality Guaranteed' },
                { icon: Zap,         text: isArabic ? 'تشطيب يدوي' : 'Hand Finished' },
                { icon: Eye,         text: product.has_led ? (isArabic ? 'LED مدمج' : 'LED Built-in') : (isArabic ? 'تفاصيل دقيقة' : 'Ultra Detail') },
                { icon: Truck,       text: isArabic ? 'توصيل لكل مصر' : 'Nationwide Delivery' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-bg-surface/60 border border-white/5 rounded-lg px-3 py-2.5">
                  <Icon size={14} className="text-gold-pure shrink-0" />
                  <span className="font-ar text-text-secondary text-xs">{text}</span>
                </div>
              ))}
            </div>

            {/* Specs accordion */}
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <button
                onClick={() => setSpecsOpen(o => !o)}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-ar font-bold text-text-cream hover:bg-white/5 transition-colors cursor-pointer"
                aria-expanded={specsOpen}
              >
                <span>{t('products.specs')}</span>
                <span className={`text-gold-pure transition-transform duration-300 ${specsOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {specsOpen && (
                <div className="border-t border-white/5 divide-y divide-white/5">
                  {specs.map(spec => (
                    <div key={spec.label_en} className="flex items-center justify-between px-5 py-3">
                      <span className="font-ar text-text-muted text-sm">{isArabic ? spec.label_ar : spec.label_en}</span>
                      <span className="font-ar text-text-cream text-sm font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn-whatsapp py-4 px-6 rounded-xl text-center font-ar font-bold text-lg flex items-center justify-center gap-3"
              >
                <MessageCircle size={20} />
                {t('products.order_now')}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary py-4 px-6 rounded-xl text-center font-ar font-semibold flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {t('products.inquire')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="container-custom py-16">
          <GoldDivider variant="ornate" label={isArabic ? 'أعمال مشابهة' : 'Similar Works'} className="mb-10" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((rel, i) => (
              <Link key={rel.slug} href={`/products/${rel.slug}`} className="group card-luxury overflow-hidden block cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={rel.thumbnail || (rel.images && rel.images[0]) || getProductPlaceholder(i + 10)}
                    alt={isArabic ? rel.name_ar : (rel.name_en ?? rel.name_ar)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-3">
                  <p className="font-ar font-bold text-text-cream text-sm leading-tight line-clamp-1">
                    {isArabic ? rel.name_ar : (rel.name_en ?? rel.name_ar)}
                  </p>
                  <p className="text-gold-pure font-ar text-xs mt-1">
                    {rel.price ? formatPrice(rel.price, lang as 'ar' | 'en') : (isArabic ? (rel.price_label_ar ?? 'تواصل للسعر') : (rel.price_label_en ?? 'Contact us'))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
