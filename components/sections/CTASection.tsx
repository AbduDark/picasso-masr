'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { getGeneralWhatsAppUrl } from '@/lib/whatsapp'
import GoldParticles from '@/components/ui/GoldParticles'

export default function CTASection() {
  const { isArabic, t, lang } = useLanguage()
  const whatsappUrl = getGeneralWhatsAppUrl(lang)

  return (
    <section
      id="cta"
      className="relative py-32 overflow-hidden noise-overlay"
      aria-label="دعوة للتواصل"
    >
      {/* Cinematic dark background */}
      <div className="absolute inset-0 bg-bg-void" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.12) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      {/* Floating orbs */}
      <div className="orb w-96 h-96 bg-gold-pure" style={{ top: '-20%', left: '20%', opacity: 0.08 }} />
      <div className="orb w-64 h-64 bg-gold-dark" style={{ bottom: '-10%', right: '15%', opacity: 0.1, animationDelay: '4s' }} />

      {/* Subtle particles */}
      <GoldParticles count={30} interactive={false} />

      {/* Content */}
      <div className="relative z-10 container-custom text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Eyebrow */}
          <span className="section-eyebrow">{t('cta.eyebrow')}</span>

          {/* Title */}
          <h2
            className="font-ar font-black text-gold-shimmer mb-6 leading-tight"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}
          >
            {t('cta.title')}
          </h2>

          {/* Subtitle */}
          <p className="font-ar text-text-secondary max-w-xl mx-auto mb-12 leading-loose text-lg">
            {t('cta.subtitle')}
          </p>

          {/* CTA Button */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-whatsapp inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-xl font-ar font-bold cursor-pointer shadow-[0_0_40px_rgba(37,211,102,0.2)] hover:shadow-[0_0_60px_rgba(37,211,102,0.35)] transition-shadow duration-300"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current shrink-0" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.558 4.122 1.526 5.853L0 24l6.278-1.649C7.967 23.438 9.945 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.488-5.196-1.344l-.373-.22-3.871 1.016 1.034-3.776-.243-.387A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            {t('cta.button')}
          </motion.a>

          {/* Note */}
          <p className="mt-5 text-text-muted font-ar text-sm">
            {t('cta.note')}
          </p>
        </motion.div>
      </div>

      {/* Letterbox lines */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold-pure/30 to-transparent" aria-hidden="true" />
      <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold-pure/30 to-transparent" aria-hidden="true" />
    </section>
  )
}
