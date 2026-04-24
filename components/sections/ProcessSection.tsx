'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { PROCESS_STEPS } from '@/lib/constants'
import GoldDivider from '@/components/ui/GoldDivider'

export default function ProcessSection() {
  const { isArabic, t } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="process" className="section-padding bg-bg-dark" aria-label="كيف نشتغل">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-eyebrow">{t('process.eyebrow')}</span>
          <h2 className="section-title font-ar">{t('process.title')}</h2>
          <p className="section-subtitle font-ar mx-auto">{t('process.subtitle')}</p>
        </div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Connector line — desktop only */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px pointer-events-none" aria-hidden="true">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.4 }}
              className="origin-right h-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), rgba(201,168,76,0.5), transparent)',
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: i * 0.15 + 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative flex flex-col items-center lg:items-start text-center lg:text-start"
              >
                {/* Step number + icon */}
                <div className="relative mb-6 z-10">
                  {/* Large background number */}
                  <span
                    className="absolute -top-4 -right-2 font-display-en font-black text-7xl text-gold-pure/5 select-none leading-none"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>

                  {/* Icon circle */}
                  <div className="relative w-20 h-20 rounded-2xl bg-bg-surface border border-gold/30 flex flex-col items-center justify-center gap-1 shadow-gold-sm group-hover:shadow-gold-md transition-shadow">
                    <span className="text-2xl" role="img" aria-hidden="true">{step.icon}</span>
                    <span className="font-display-en text-gold-pure text-xs font-bold tracking-widest">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Text */}
                <div className="px-2">
                  <h3 className="font-ar font-bold text-text-cream text-lg mb-3">
                    {isArabic ? step.title_ar : step.title_en}
                  </h3>
                  <p className="font-ar text-text-secondary text-sm leading-loose">
                    {isArabic ? step.desc_ar : step.desc_en}
                  </p>
                </div>

                {/* Mobile connector */}
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="lg:hidden w-px h-8 bg-gradient-to-b from-gold/40 to-transparent mt-6 mx-auto" aria-hidden="true" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <GoldDivider variant="ornate" label={isArabic ? 'كل خطوة بعناية' : 'Every step with care'} className="mt-16" />
      </div>
    </section>
  )
}
