'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/components/providers/LanguageProvider'
import GoldDivider from '@/components/ui/GoldDivider'

const VALUES = [
  { icon: '🏆', key: 'value1' },
  { icon: '🎯', key: 'value2' },
  { icon: '🤝', key: 'value3' },
  { icon: '🎨', key: 'value4' },
]

const TIMELINE = [
  { year: '٢٠١٩', year_en: '2019', event_ar: 'البداية من ورشة صغيرة في القاهرة بطابعة واحدة', event_en: 'Started in a small Cairo workshop with a single printer' },
  { year: '٢٠٢٠', year_en: '2020', event_ar: 'أول ظهور في Comic Con مصر', event_en: 'First appearance at Egypt Comic Con' },
  { year: '٢٠٢١', year_en: '2021', event_ar: 'تجاوزنا ١٠٠ قطعة منجزة', event_en: 'Surpassed 100 completed pieces' },
  { year: '٢٠٢٢', year_en: '2022', event_ar: 'توسعة الورشة وانضمام فريق الفنانين', event_en: 'Workshop expansion and artists team joined' },
  { year: '٢٠٢٤', year_en: '2024', event_ar: '٥٠٠+ قطعة ورضا عملاء ١٠٠٪', event_en: '500+ pieces and 100% client satisfaction' },
]

export default function AboutPage() {
  const { isArabic, t } = useLanguage()

  return (
    <main className="min-h-screen bg-bg-void">
      {/* Hero */}
      <section className="relative pt-32 pb-20 text-center noise-overlay overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.1) 0%, transparent 60%)' }} />
        <div className="relative z-10 container-custom max-w-3xl">
          <span className="section-eyebrow">{t('about.eyebrow')}</span>
          <h1 className="section-title font-ar">{t('about.title')}</h1>
          <GoldDivider variant="ornate" className="my-8" />
          <p className="font-ar text-text-secondary leading-loose text-lg">{t('about.story')}</p>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-bg-dark">
        <div className="container-custom max-w-2xl">
          <div className="text-center mb-14">
            <h2 className="section-title font-ar">{isArabic ? 'رحلتنا' : 'Our Journey'}</h2>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute right-16 md:right-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-pure/30 to-transparent" aria-hidden="true" />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-6 relative"
                >
                  {/* Year */}
                  <div className="w-14 shrink-0 text-end">
                    <span className="font-display-en font-black text-gold-pure text-sm">
                      {isArabic ? item.year : item.year_en}
                    </span>
                  </div>

                  {/* Dot */}
                  <div className="relative z-10 mt-1 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-gold-pure shadow-gold-sm" />
                  </div>

                  {/* Event */}
                  <p className="font-ar text-text-secondary text-sm leading-relaxed pt-0.5">
                    {isArabic ? item.event_ar : item.event_en}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-bg-void">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="section-title font-ar">{t('about.values_title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card-luxury p-6 text-center hover:shadow-gold-md transition-shadow"
              >
                <div className="text-4xl mb-4" role="img" aria-hidden="true">{icon}</div>
                <h3 className="font-ar font-bold text-gold-pure text-lg mb-3">
                  {t(`about.${key}_title`)}
                </h3>
                <p className="font-ar text-text-secondary text-sm leading-relaxed">
                  {t(`about.${key}_desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
