'use client'

import Link from 'next/link'
import { Instagram, Facebook, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { NAV_ITEMS } from '@/lib/constants'
import { getGeneralWhatsAppUrl } from '@/lib/whatsapp'
import GoldDivider from '@/components/ui/GoldDivider'

export default function Footer() {
  const { isArabic, t, lang } = useLanguage()
  const year = new Date().getFullYear()
  const whatsappUrl = getGeneralWhatsAppUrl(lang)

  return (
    <footer className="bg-bg-dark border-t border-gold/20 noise-overlay" aria-label="التذييل">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Col 1 — Brand */}
          <div className="space-y-4">
            <div>
              <p className="font-ar font-black text-2xl text-gold-pure mb-1">بيكاسو مصر</p>
              <p className="font-display-en text-[0.5rem] tracking-[0.4em] text-gold-muted uppercase mb-4">
                PICASSO MASR
              </p>
            </div>
            <p className="text-text-secondary font-ar text-sm leading-relaxed max-w-xs">
              {isArabic ? t('footer.tagline') : t('footer.tagline')}
            </p>
            <p className="text-gold-muted font-ar text-sm font-semibold">
              {t('footer.made_in')}
            </p>
          </div>

          {/* Col 2 — Quick Links */}
          <div className="space-y-4">
            <h3 className="font-ar font-bold text-text-cream text-base">
              {t('footer.quick_links')}
            </h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-gold-pure font-ar text-sm transition-colors duration-200 cursor-pointer inline-block"
                  >
                    {isArabic ? item.label_ar : item.label_en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div className="space-y-4">
            <h3 className="font-ar font-bold text-text-cream text-base">
              {t('footer.contact_us')}
            </h3>
            <div className="space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-text-secondary hover:text-whatsapp-light transition-colors duration-200 font-ar text-sm cursor-pointer group"
              >
                <span className="w-8 h-8 rounded-full bg-whatsapp/10 border border-whatsapp/20 flex items-center justify-center group-hover:bg-whatsapp/20 transition-colors">
                  <MessageCircle size={14} className="text-whatsapp-light" />
                </span>
                {isArabic ? 'واتساب' : 'WhatsApp'}
              </a>

              <a
                href="https://instagram.com/picassomasr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-text-secondary hover:text-pink-400 transition-colors duration-200 font-ar text-sm cursor-pointer group"
              >
                <span className="w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                  <Instagram size={14} className="text-pink-400" />
                </span>
                {isArabic ? 'إنستاغرام' : 'Instagram'}
              </a>

              <a
                href="https://facebook.com/picassomasr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-text-secondary hover:text-blue-400 transition-colors duration-200 font-ar text-sm cursor-pointer group"
              >
                <span className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Facebook size={14} className="text-blue-400" />
                </span>
                {isArabic ? 'فيسبوك' : 'Facebook'}
              </a>
            </div>

            <p className="text-text-muted font-ar text-xs pt-2">
              {t('footer.working_hours')}
            </p>
          </div>
        </div>

        <GoldDivider variant="line" className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-text-muted text-xs font-ar">
          <p>{t('footer.rights')} {year}</p>
          <p className="font-display-en tracking-widest text-[0.6rem] uppercase text-gold-muted">
            Crafted with ♦ in Egypt
          </p>
        </div>
      </div>
    </footer>
  )
}
