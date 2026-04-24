'use client'

import { useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { STATS } from '@/lib/constants'
import CountUp from '@/components/ui/CountUp'

export default function StatsSection() {
  const { isArabic, t } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="stats"
      className="relative py-24 bg-bg-card overflow-hidden"
      aria-label="الإنجازات"
    >
      {/* Top/bottom gold borders */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-pure/50 to-transparent" aria-hidden="true" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-pure/50 to-transparent" aria-hidden="true" />

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="section-eyebrow">{t('stats.eyebrow')}</span>
        </div>

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((stat, i) => (
            <StatCard
              key={i}
              stat={stat}
              index={i}
              inView={inView}
              isArabic={isArabic}
              t={t}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({
  stat,
  index,
  inView,
  isArabic,
  t,
}: {
  stat: typeof STATS[0]
  index: number
  inView: boolean
  isArabic: boolean
  t: (k: string) => string
}) {
  const statKeys = ['masks_delivered', 'years_experience', 'avg_time', 'satisfaction'] as const

  return (
    <div className="text-center group">
      {/* Number */}
      <div
        className="font-display-en font-black text-gold-shimmer mb-3"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}
      >
        <CountUp
          end={stat.value}
          suffix={stat.suffix}
          duration={2200}
          trigger={inView}
        />
      </div>

      {/* Divider */}
      <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold-pure to-transparent mx-auto mb-3 transition-all duration-500 group-hover:w-24" />

      {/* Label */}
      <p className="font-ar text-text-secondary text-sm leading-relaxed">
        {isArabic ? stat.label_ar : stat.label_en}
      </p>
    </div>
  )
}
