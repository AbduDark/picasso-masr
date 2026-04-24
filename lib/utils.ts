import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u0600-\u06FF\s]+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function formatPrice(price: number | null, lang: 'ar' | 'en' = 'ar'): string {
  if (price === null) return lang === 'ar' ? 'تواصل للسعر' : 'Contact for price'
  const formatted = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(price)
  return lang === 'ar' ? `${formatted} جنيه` : `EGP ${formatted}`
}

export function formatDate(dateString: string, lang: 'ar' | 'en' = 'ar'): string {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(dateString))
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function isValidEgyptianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return /^(01)[0125][0-9]{8}$/.test(cleaned)
}

export function getProductPlaceholder(index: number): string {
  const ids = [21, 28, 36, 39, 42, 55, 60, 70, 80, 90]
  return `https://picsum.photos/seed/pm${ids[index % ids.length]}/600/750`
}
