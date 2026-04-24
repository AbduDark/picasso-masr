'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { SEED_TESTIMONIALS } from '@/lib/constants'
import GoldDivider from '@/components/ui/GoldDivider'
import type { DBTestimonial } from '@/lib/data'

interface Props {
  testimonials: DBTestimonial[]
}

export default function TestimonialsSection({ testimonials }: Props) {
  const { isArabic, t } = useLanguage()
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [direction, setDirection] = useState(0)

  // Use real testimonials or fallback to seeds
  const items = testimonials.length > 0
    ? testimonials
    : SEED_TESTIMONIALS as unknown as DBTestimonial[]

  const prev = () => {
    setDirection(-1)
    setCurrent(c => (c - 1 + items.length) % items.length)
  }
  const next = () => {
    setDirection(1)
    setCurrent(c => (c + 1) % items.length)
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
  }

  const active = items[current]

  return (
    <section id="testimonials" className="section-padding bg-bg-dark" aria-label="آراء العملاء">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-eyebrow">{t('testimonials.eyebrow')}</span>
          <h2 className="section-title font-ar">{t('testimonials.title')}</h2>
          <p className="section-subtitle font-ar mx-auto">{t('testimonials.subtitle')}</p>
        </div>

        {/* Carousel */}
        <div ref={ref} className="relative max-w-2xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              className="card-luxury p-8 md:p-10 text-center"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6" aria-label={`تقييم ${active.rating} من 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < active.rating ? 'fill-gold-pure text-gold-pure' : 'text-gold-muted'}
                  />
                ))}
              </div>

              {/* Review text */}
              <blockquote className="font-ar text-text-secondary leading-loose text-base md:text-lg mb-8 italic">
                &ldquo;{isArabic ? active.content_ar : (active.content_en ?? active.content_ar)}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-px bg-gold-pure/40 mb-3" aria-hidden="true" />
                <p className="font-ar font-bold text-text-cream">{active.name}</p>
                {active.city && (
                  <p className="font-ar text-text-muted text-sm">{active.city}</p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border border-gold/30 flex items-center justify-center text-text-secondary hover:text-gold-pure hover:border-gold/60 transition-all duration-200 cursor-pointer"
              aria-label="السابق"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2" role="tablist" aria-label="التنقل بين الآراء">
              {items.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    i === current
                      ? 'w-6 h-2 bg-gold-pure'
                      : 'w-2 h-2 bg-gold-muted/40 hover:bg-gold-muted'
                  }`}
                  aria-label={`رأي ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 rounded-full border border-gold/30 flex items-center justify-center text-text-secondary hover:text-gold-pure hover:border-gold/60 transition-all duration-200 cursor-pointer"
              aria-label="التالي"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

        <GoldDivider variant="dots" className="mt-14" />
      </div>
    </section>
  )
}
