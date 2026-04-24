'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { NAV_ITEMS } from '@/lib/constants'
import { getGeneralWhatsAppUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const { lang, dir, t, toggleLanguage, isArabic } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('/')
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Trap focus when mobile menu is open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const whatsappUrl = getGeneralWhatsAppUrl(lang)

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 2.2 }}
        className={cn(
          'fixed top-0 inset-x-0 z-40 transition-all duration-500',
          scrolled ? 'navbar-glass py-3' : 'bg-transparent py-5',
        )}
        aria-label="التنقل الرئيسي"
      >
        <div className="container-custom flex items-center justify-between">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="group flex flex-col leading-none gap-0.5 cursor-pointer"
            aria-label="بيكاسو مصر — الصفحة الرئيسية"
          >
            <span className="font-ar font-black text-xl text-gold-shimmer group-hover:opacity-90 transition-opacity">
              بيكاسو مصر
            </span>
            <span className="font-display-en text-[0.45rem] tracking-[0.35em] text-gold-muted uppercase">
              PICASSO MASR
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveLink(item.href)}
                className={cn(
                  'relative px-4 py-2 text-sm font-ar font-semibold transition-colors duration-200 cursor-pointer',
                  'text-text-secondary hover:text-text-cream',
                  activeLink === item.href && 'text-gold-pure',
                  'group',
                )}
              >
                {isArabic ? item.label_ar : item.label_en}
                {/* Underline expand from center */}
                <span
                  className={cn(
                    'absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-gold-pure transition-all duration-300',
                    activeLink === item.href ? 'w-4/5' : 'w-0 group-hover:w-3/5',
                  )}
                />
              </Link>
            ))}
          </div>

          {/* ── Right Controls ── */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/30 text-text-secondary hover:text-gold-pure hover:border-gold/60 transition-all duration-200 text-xs font-ar font-semibold cursor-pointer"
              aria-label={isArabic ? 'Switch to English' : 'التحويل للعربية'}
            >
              <Globe size={12} />
              <span>{isArabic ? 'EN' : 'عربي'}</span>
            </button>

            {/* WhatsApp CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 btn-whatsapp px-4 py-2 text-sm cursor-pointer rounded-lg"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.558 4.122 1.526 5.853L0 24l6.278-1.649C7.967 23.438 9.945 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.488-5.196-1.344l-.373-.22-3.871 1.016 1.034-3.776-.243-.387A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              {isArabic ? 'اطلب دلوقتي' : 'Order Now'}
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(prev => !prev)}
              className="md:hidden p-2 text-text-secondary hover:text-gold-pure transition-colors cursor-pointer"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={22} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={22} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              key="drawer"
              initial={{ x: dir === 'rtl' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: dir === 'rtl' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={cn(
                'fixed top-0 bottom-0 z-40 w-72 bg-bg-dark border-gold/20 flex flex-col md:hidden',
                dir === 'rtl' ? 'right-0 border-l' : 'left-0 border-r',
              )}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div className="flex flex-col gap-0.5">
                  <span className="font-ar font-black text-lg text-gold-pure">بيكاسو مصر</span>
                  <span className="font-display-en text-[0.4rem] tracking-[0.35em] text-gold-muted uppercase">PICASSO MASR</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-text-muted hover:text-text-cream transition-colors cursor-pointer"
                  aria-label="إغلاق القائمة"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 px-4 py-6 space-y-1">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 + 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => { setMobileOpen(false); setActiveLink(item.href) }}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-text-secondary hover:text-text-cream hover:bg-white/5 transition-all duration-200 font-ar font-semibold cursor-pointer"
                    >
                      {isArabic ? item.label_ar : item.label_en}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer Footer */}
              <div className="px-4 py-6 border-t border-white/5 space-y-3">
                <button
                  onClick={() => { toggleLanguage(); setMobileOpen(false) }}
                  className="flex items-center gap-2 w-full px-4 py-3 rounded-lg border border-gold/30 text-text-secondary hover:text-gold-pure hover:border-gold/60 transition-all duration-200 font-ar text-sm cursor-pointer"
                >
                  <Globe size={16} />
                  {isArabic ? 'Switch to English' : 'التحويل للعربية'}
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full btn-whatsapp px-4 py-3 rounded-lg text-sm font-ar font-bold"
                >
                  {isArabic ? 'ابعتلنا على واتساب' : 'Message on WhatsApp'}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
