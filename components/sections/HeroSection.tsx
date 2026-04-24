'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ShieldCheck, Paintbrush, Truck, ArrowDown } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { getGeneralWhatsAppUrl } from '@/lib/whatsapp'
import GoldParticles from '@/components/ui/GoldParticles'

const trustItems = [
  { icon: ShieldCheck, key: 'trust_quality' },
  { icon: Paintbrush,  key: 'trust_handmade' },
  { icon: Truck,       key: 'trust_delivery' },
]

const HERO_WORDS_AR = ['صنعة', 'تستحق', 'التُّوِّج']
const HERO_WORDS_EN = ['Where', 'Art', 'Meets', 'Identity']

export default function HeroSection() {
  const { isArabic, t, lang } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const whatsappUrl = getGeneralWhatsAppUrl(lang)
  const words = isArabic ? HERO_WORDS_AR : HERO_WORDS_EN

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  }
  const wordVariant = {
    hidden: { opacity: 0, y: 40 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden noise-overlay"
      aria-label="القسم الرئيسي"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />

      {/* Floating orbs */}
      <div className="orb w-96 h-96 bg-gold-pure" style={{ top: '-10%', right: '10%', animationDelay: '0s' }} />
      <div className="orb w-64 h-64 bg-gold-dark" style={{ bottom: '15%', left: '5%', animationDelay: '3s' }} />
      <div className="orb w-48 h-48 bg-gold-light" style={{ top: '40%', right: '5%', animationDelay: '6s', opacity: 0.08 }} />

      {/* Gold Particles */}
      <GoldParticles count={70} interactive />

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          className="mb-6"
        >
          <span className="section-eyebrow">{t('hero.eyebrow')}</span>
        </motion.div>

        {/* Main Title — word by word */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={`mb-6 leading-tight ${isArabic ? 'font-ar font-black' : 'font-display-en'}`}
          style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)' }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className="inline-block text-gold-shimmer mx-2"
              style={{ transitionDelay: `${2.4 + i * 0.12}s` }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.9, duration: 0.7 }}
          className="font-ar text-text-secondary mb-10 max-w-2xl mx-auto leading-loose"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.1, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp px-8 py-4 rounded-xl text-lg font-ar font-bold flex items-center gap-3 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.558 4.122 1.526 5.853L0 24l6.278-1.649C7.967 23.438 9.945 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.488-5.196-1.344l-.373-.22-3.871 1.016 1.034-3.776-.243-.387A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            {t('hero.cta_primary')}
          </a>

          <a
            href="#products"
            className="btn-secondary px-8 py-4 rounded-xl text-lg font-ar cursor-pointer"
          >
            {t('hero.cta_secondary')}
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10"
        >
          {trustItems.map(({ icon: Icon, key }) => (
            <div key={key} className="flex items-center gap-2 text-text-secondary">
              <div className="w-8 h-8 rounded-full bg-gold-pure/10 border border-gold/30 flex items-center justify-center">
                <Icon size={14} className="text-gold-pure" />
              </div>
              <span className="font-ar text-sm font-semibold">{t(`hero.${key}`)}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center text-gold-muted"
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-bg-void to-transparent pointer-events-none" />
    </section>
  )
}
