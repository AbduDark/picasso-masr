'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Clock, Instagram, Facebook, MessageCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { orderFormSchema, type OrderFormData } from '@/lib/validations'
import { getGeneralWhatsAppUrl } from '@/lib/whatsapp'
import { EGYPTIAN_CITIES } from '@/lib/constants'
import { buildWhatsAppUrl } from '@/lib/utils'
import { Input, Textarea, Select } from '@/components/ui/Input'
import GoldDivider from '@/components/ui/GoldDivider'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '201000000000'

export default function OrderPage() {
  const { isArabic, t, lang } = useLanguage()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: { contact_preference: 'whatsapp' },
  })

  const onSubmit = async (data: OrderFormData) => {
    setLoading(true)
    try {
      // Save to Supabase inquiries
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          product_name: data.product_interest,
          message: `[${data.city}] ${data.notes ?? ''}`.trim(),
        }),
      })

      // Build WhatsApp message
      const msg = isArabic
        ? `مرحباً بيكاسو مصر 🎭\n\nأنا ${data.name} من ${data.city}\nمهتم بـ ${data.product_interest}\n${data.notes ? `\nملاحظات: ${data.notes}` : ''}\n\nشكراً 🙏`
        : `Hello Picasso Masr 🎭\n\nI am ${data.name} from ${data.city}\nInterested in: ${data.product_interest}\n${data.notes ? `\nNotes: ${data.notes}` : ''}\n\nThank you 🙏`

      const url = buildWhatsAppUrl(WHATSAPP, msg)
      setSubmitted(true)
      toast.success(t('order.success'))
      setTimeout(() => window.open(url, '_blank'), 500)
    } catch {
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const cityOptions = EGYPTIAN_CITIES.map(c => ({ value: c, label: c }))

  return (
    <main className="min-h-screen bg-bg-void">
      {/* Page Header */}
      <section className="relative pt-32 pb-16 text-center noise-overlay overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.1) 0%, transparent 60%)' }} />
        <div className="relative z-10 container-custom">
          <span className="section-eyebrow">{t('order.eyebrow')}</span>
          <h1 className="section-title font-ar">{t('order.title')}</h1>
          <p className="section-subtitle font-ar mx-auto">{t('order.subtitle')}</p>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-pure/30 to-transparent" />
      </section>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-luxury p-10 text-center"
              >
                <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                <h2 className="font-ar font-black text-text-cream text-2xl mb-3">
                  {isArabic ? 'تم إرسال طلبك! 🎉' : 'Order Sent! 🎉'}
                </h2>
                <p className="font-ar text-text-secondary">
                  {isArabic ? 'هيفتح واتساب دلوقتي — بنرد خلال ساعات' : 'WhatsApp is opening — we reply within hours'}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="card-luxury p-8 space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label={t('order.name')}
                    placeholder={isArabic ? 'اسمك الكامل' : 'Your full name'}
                    required
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    label={t('order.phone')}
                    placeholder="01012345678"
                    type="tel"
                    required
                    error={errors.phone?.message}
                    dir="ltr"
                    {...register('phone')}
                  />
                </div>

                <Select
                  label={t('order.city')}
                  options={[{ value: '', label: isArabic ? 'اختار المحافظة' : 'Select city' }, ...cityOptions]}
                  required
                  error={errors.city?.message}
                  {...register('city')}
                />

                <Input
                  label={t('order.product')}
                  placeholder={isArabic ? 'مثال: خوذة أوبتيموس برايم' : 'e.g. Optimus Prime Helmet'}
                  required
                  error={errors.product_interest?.message}
                  {...register('product_interest')}
                />

                <Textarea
                  label={t('order.notes')}
                  placeholder={isArabic ? 'أي تفاصيل إضافية — ألوان، قياسات، مناسبة...' : 'Any extra details — colors, sizes, occasion...'}
                  rows={4}
                  {...register('notes')}
                />

                {/* Contact preference */}
                <div>
                  <p className="text-sm font-semibold text-text-secondary font-ar mb-3">{t('order.contact_pref')}</p>
                  <div className="flex gap-3">
                    {(['whatsapp', 'call'] as const).map(pref => (
                      <label key={pref} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          value={pref}
                          {...register('contact_preference')}
                          className="accent-gold-pure"
                        />
                        <span className="font-ar text-sm text-text-secondary group-hover:text-text-cream transition-colors">
                          {pref === 'whatsapp' ? t('order.pref_whatsapp') : t('order.pref_call')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-whatsapp w-full py-4 rounded-xl font-ar font-bold text-lg flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span className="font-ar">{t('common.loading')}</span>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.558 4.122 1.526 5.853L0 24l6.278-1.649C7.967 23.438 9.945 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.488-5.196-1.344l-.373-.22-3.871 1.016 1.034-3.776-.243-.387A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      </svg>
                      {t('order.submit')}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-luxury p-6 space-y-5">
              <h3 className="font-ar font-bold text-text-cream text-lg">
                {isArabic ? 'أو تواصل معنا مباشرة' : 'Or reach us directly'}
              </h3>
              <GoldDivider variant="line" className="my-0" />

              <a
                href={getGeneralWhatsAppUrl(lang)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-whatsapp/10 border border-whatsapp/20 hover:bg-whatsapp/20 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-whatsapp/20 flex items-center justify-center shrink-0">
                  <MessageCircle size={20} className="text-whatsapp-light" />
                </div>
                <div>
                  <p className="font-ar font-bold text-text-cream text-sm">WhatsApp</p>
                  <p className="font-ar text-text-muted text-xs dir-ltr">+{WHATSAPP}</p>
                </div>
              </a>

              <a href="https://instagram.com/picassomasr" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
                  <Instagram size={20} className="text-pink-400" />
                </div>
                <div>
                  <p className="font-ar font-bold text-text-cream text-sm">Instagram</p>
                  <p className="font-ar text-text-muted text-xs">@picassomasr</p>
                </div>
              </a>

              <a href="https://facebook.com/picassomasr" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Facebook size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="font-ar font-bold text-text-cream text-sm">Facebook</p>
                  <p className="font-ar text-text-muted text-xs">Picasso Masr</p>
                </div>
              </a>
            </div>

            <div className="card-luxury p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={18} className="text-gold-pure" />
                <h3 className="font-ar font-bold text-text-cream">{isArabic ? 'مواعيد الرد' : 'Response Hours'}</h3>
              </div>
              <p className="font-ar text-text-secondary text-sm leading-relaxed">
                {isArabic
                  ? 'السبت — الخميس: ١٠ الصبح لـ ١٠ بالليل\nبنرد على الرسائل خلال ساعات — مش أيام.'
                  : 'Sat — Thu: 10am to 10pm\nWe reply to messages within hours — not days.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
