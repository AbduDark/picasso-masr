'use client'

import { useLanguage } from '@/components/providers/LanguageProvider'

const TICKER_ITEMS_AR = [
  '✦ طباعة ثلاثية الأبعاد',
  '✦ تشطيب يدوي',
  '✦ توصيل لكل مصر',
  '✦ ٥٠٠+ قطعة منجزة',
  '✦ فنانين مصريين',
  '✦ ضمان الجودة',
]

const TICKER_ITEMS_EN = [
  '✦ 3D Printing',
  '✦ Hand Finished',
  '✦ Nationwide Delivery',
  '✦ 500+ Pieces Delivered',
  '✦ Egyptian Artists',
  '✦ Quality Guaranteed',
]

export default function MarqueeBar() {
  const { isArabic } = useLanguage()
  const items = isArabic ? TICKER_ITEMS_AR : TICKER_ITEMS_EN
  const doubled = [...items, ...items] // duplicate for infinite effect

  return (
    <div
      className="marquee-container bg-gold-pure py-3 overflow-hidden"
      aria-hidden="true"
    >
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-block px-6 font-ar font-black text-bg-void text-sm tracking-wide whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
