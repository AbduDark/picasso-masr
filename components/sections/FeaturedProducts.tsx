'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { getProductWhatsAppUrl } from '@/lib/whatsapp'
import { getProductPlaceholder, formatPrice } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import GoldDivider from '@/components/ui/GoldDivider'
import type { DBProduct } from '@/lib/data'

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show:   (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  }),
}

interface Props {
  products: DBProduct[]
}

export default function FeaturedProducts({ products }: Props) {
  const { isArabic, t, lang } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="products" className="section-padding bg-bg-void" aria-label="أشهر الأعمال">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-eyebrow">{t('products.eyebrow')}</span>
          <h2 className="section-title font-ar">{t('products.title')}</h2>
          <p className="section-subtitle font-ar mx-auto">{t('products.subtitle')}</p>
          <GoldDivider variant="dots" className="mt-6 mb-0" />
        </div>

        {/* Grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.map((product, i) => (
            <motion.div
              key={product.slug}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
            >
              <ProductCard product={product} index={i} lang={lang} isArabic={isArabic} t={t} />
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="btn-secondary px-8 py-4 rounded-xl font-ar font-semibold text-base inline-flex items-center gap-2 cursor-pointer"
          >
            {t('products.view_all')}
            <span className="text-gold-pure">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Product Card ──────────────────────────────────────
interface ProductCardProps {
  product: DBProduct
  index: number
  lang: string
  isArabic: boolean
  t: (key: string) => string
}

function ProductCard({ product, index, lang, isArabic, t }: ProductCardProps) {
  const whatsappUrl = getProductWhatsAppUrl(
    isArabic ? product.name_ar : (product.name_en ?? product.name_ar),
    lang as 'ar' | 'en',
  )

  // Use real thumbnail if available, otherwise placeholder
  const imgSrc  = product.thumbnail || (product.images?.[0]) || getProductPlaceholder(index)
  const imgSrc2 = product.images?.[1] || getProductPlaceholder(index + 7)

  return (
    <article className="group card-luxury overflow-hidden cursor-pointer h-full flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {/* Primary image */}
        <Image
          src={imgSrc}
          alt={isArabic ? product.name_ar : (product.name_en ?? product.name_ar)}
          fill
          className="object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Hover image */}
        <Image
          src={imgSrc2}
          alt=""
          fill
          aria-hidden="true"
          className="object-cover opacity-0 scale-105 transition-all duration-700 group-hover:opacity-100 group-hover:scale-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-void/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {product.is_new && (
            <Badge variant="gold">{t('products.badge_new')}</Badge>
          )}
          {product.has_led && (
            <Badge variant="blue">{t('products.badge_led')}</Badge>
          )}
          {product.category === 'custom' && (
            <Badge variant="silver">{t('products.badge_custom')}</Badge>
          )}
        </div>

        {/* Hover action buttons */}
        <div className="absolute bottom-4 inset-x-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex-1 btn-whatsapp py-2.5 text-sm rounded-lg text-center font-ar font-bold"
          >
            {t('products.order_now')}
          </a>
          <Link
            href={`/products/${product.slug}`}
            className="px-3 py-2.5 bg-bg-surface/80 backdrop-blur-sm border border-gold/30 rounded-lg text-gold-pure hover:bg-gold-pure/10 transition-colors text-sm"
            aria-label={`تفاصيل ${product.name_ar}`}
          >
            <Zap size={16} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Franchise */}
        {product.franchise && (
          <p className="text-xs text-gold-muted font-display-en tracking-widest uppercase mb-1">
            {product.franchise}
          </p>
        )}

        {/* Name */}
        <h3 className="font-ar font-bold text-text-cream text-lg leading-tight mb-1">
          {isArabic ? product.name_ar : (product.name_en ?? product.name_ar)}
        </h3>
        <p className="text-xs text-text-muted font-ar mb-3 flex-1">
          {isArabic ? product.description_ar : (product.description_en ?? product.description_ar)}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-gold-pure font-ar font-bold text-lg">
            {product.price
              ? formatPrice(product.price, lang as 'ar' | 'en')
              : (isArabic ? (product.price_label_ar ?? 'تواصل للسعر') : (product.price_label_en ?? 'Contact us'))}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="text-xs text-text-muted hover:text-gold-pure font-ar transition-colors underline underline-offset-2 cursor-pointer"
          >
            {t('products.more_info')}
          </Link>
        </div>
      </div>
    </article>
  )
}
