'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Search, SlidersHorizontal, Zap } from 'lucide-react'
import type { Metadata } from 'next'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { getProductWhatsAppUrl } from '@/lib/whatsapp'
import { getProductPlaceholder, formatPrice } from '@/lib/utils'
import { SEED_PRODUCTS, PRODUCT_CATEGORIES } from '@/lib/constants'
import Badge from '@/components/ui/Badge'
import GoldDivider from '@/components/ui/GoldDivider'

const SORT_OPTIONS_AR = ['الأحدث', 'السعر: الأقل', 'السعر: الأعلى']
const SORT_OPTIONS_EN = ['Newest', 'Price: Low', 'Price: High']

export default function ProductsPage() {
  const { isArabic, t, lang } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  const filtered = SEED_PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory
    const name = isArabic ? p.name_ar : p.name_en
    const matchSearch = name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <main className="min-h-screen bg-bg-void">
      {/* Page Header */}
      <div className="relative pt-32 pb-16 text-center noise-overlay overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.1) 0%, transparent 60%)' }} />
        <div className="relative z-10 container-custom">
          <span className="section-eyebrow">{t('products.eyebrow')}</span>
          <h1 className="section-title font-ar">{t('products.title')}</h1>
          <p className="section-subtitle font-ar mx-auto">{t('products.subtitle')}</p>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-pure/30 to-transparent" />
      </div>

      <div className="container-custom py-12">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-4 text-text-muted" />
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isArabic ? 'ابحث عن منتج...' : 'Search products...'}
              className="input-luxury font-ar pr-10 w-full"
              aria-label={isArabic ? 'بحث في المنتجات' : 'Search products'}
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {PRODUCT_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-ar font-semibold border transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.value
                    ? 'bg-gold-pure/15 border-gold-pure/60 text-gold-pure'
                    : 'border-white/10 text-text-secondary hover:border-gold/30 hover:text-text-cream'
                }`}
              >
                {isArabic ? cat.label_ar : cat.label_en}
              </button>
            ))}
          </div>
        </div>

        <GoldDivider variant="line" className="mb-10" />

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-text-muted font-ar text-lg">{isArabic ? 'مفيش منتجات مطابقة' : 'No products found'}</p>
            </div>
          ) : (
            filtered.map((product, i) => (
              <motion.article
                key={product.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group card-luxury overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={getProductPlaceholder(i)}
                    alt={isArabic ? product.name_ar : product.name_en}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-void/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                    {product.is_new && <Badge variant="gold">{t('products.badge_new')}</Badge>}
                    {product.has_led && <Badge variant="blue">{t('products.badge_led')}</Badge>}
                    {product.category === 'custom' && <Badge variant="silver">{t('products.badge_custom')}</Badge>}
                  </div>

                  {/* Hover actions */}
                  <div className="absolute bottom-4 inset-x-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <a
                      href={getProductWhatsAppUrl(isArabic ? product.name_ar : product.name_en, lang as 'ar' | 'en')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 btn-whatsapp py-2.5 text-sm rounded-lg text-center font-ar font-bold"
                    >
                      {t('products.order_now')}
                    </a>
                    <Link
                      href={`/products/${product.slug}`}
                      className="px-3 py-2.5 bg-bg-surface/80 backdrop-blur border border-gold/30 rounded-lg text-gold-pure hover:bg-gold/10 transition-colors"
                      aria-label={`تفاصيل ${product.name_ar}`}
                    >
                      <Zap size={16} />
                    </Link>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  {product.franchise && (
                    <p className="text-xs text-gold-muted font-display-en tracking-widest uppercase mb-1">{product.franchise}</p>
                  )}
                  <h2 className="font-ar font-bold text-text-cream text-lg leading-tight mb-2">
                    {isArabic ? product.name_ar : product.name_en}
                  </h2>
                  <p className="text-xs text-text-muted font-ar leading-relaxed flex-1 mb-4">
                    {isArabic ? product.description_ar : product.description_en}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-gold-pure font-ar font-bold">
                      {formatPrice(product.price, lang as 'ar' | 'en')}
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-xs text-text-muted hover:text-gold-pure font-ar transition-colors underline underline-offset-2"
                    >
                      {t('products.more_info')}
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
