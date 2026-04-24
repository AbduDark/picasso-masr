'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { getProductPlaceholder } from '@/lib/utils'
import GoldDivider from '@/components/ui/GoldDivider'
import type { DBGalleryItem } from '@/lib/data'

// Heights for masonry-like effect
const HEIGHTS = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[3/4]']

// Placeholder gallery if no real images yet
function buildPlaceholderItems() {
  return Array.from({ length: 9 }, (_, i) => ({
    id: String(i),
    image_url: getProductPlaceholder(i + 1),
    caption_ar: 'قناع مخصص',
    caption_en: 'Custom Mask',
    is_featured: false,
    sort_order: i,
  }))
}

interface Props {
  items: DBGalleryItem[]
}

export default function GallerySection({ items }: Props) {
  const { isArabic, t } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Use real items or fallback to placeholders
  const displayItems = items.length > 0 ? items : buildPlaceholderItems()

  return (
    <section id="gallery" className="section-padding bg-bg-void" aria-label="معرض الأعمال">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-eyebrow">{t('gallery.eyebrow')}</span>
          <h2 className="section-title font-ar">{t('gallery.title')}</h2>
          <p className="section-subtitle font-ar mx-auto">{t('gallery.subtitle')}</p>
          <GoldDivider variant="dots" className="mt-6 mb-0" />
        </div>

        {/* Grid */}
        <div
          ref={ref}
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        >
          {displayItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="break-inside-avoid relative overflow-hidden rounded-xl border border-gold/10 group cursor-pointer"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={`relative w-full ${HEIGHTS[i % HEIGHTS.length]}`}>
                <Image
                  src={item.image_url}
                  alt={isArabic ? (item.caption_ar ?? '') : (item.caption_en ?? item.caption_ar ?? '')}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Overlay */}
                <motion.div
                  initial={false}
                  animate={{ opacity: hoveredId === item.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-bg-void/90 via-bg-void/40 to-transparent flex flex-col justify-end p-4"
                >
                  {(item.caption_ar || item.caption_en) && (
                    <p className="text-text-cream font-ar font-bold text-sm">
                      {isArabic ? item.caption_ar : (item.caption_en ?? item.caption_ar)}
                    </p>
                  )}
                </motion.div>

                {/* Gold frame on hover */}
                <motion.div
                  initial={false}
                  animate={{ opacity: hoveredId === item.id ? 1 : 0 }}
                  className="absolute inset-0 rounded-xl border-2 border-gold/50 pointer-events-none"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="btn-secondary px-8 py-4 rounded-xl font-ar font-semibold text-base inline-flex items-center gap-2 cursor-pointer"
          >
            {t('gallery.view_all')}
            <span className="text-gold-pure">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
