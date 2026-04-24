import { buildWhatsAppUrl } from './utils'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '201000000000'

export function getGeneralWhatsAppUrl(lang: 'ar' | 'en' = 'ar'): string {
  const message = lang === 'ar'
    ? 'مرحباً بيكاسو مصر 🎭\nمهتم بأعمالكم. ممكن أعرف أكتر؟'
    : 'Hello Picasso Masr 🎭\nI am interested in your work. Can I learn more?'
  return buildWhatsAppUrl(WHATSAPP_NUMBER, message)
}

export function getProductWhatsAppUrl(productName: string, lang: 'ar' | 'en' = 'ar'): string {
  const message = lang === 'ar'
    ? `مرحباً بيكاسو مصر 🎭\n\nعايز أطلب: ${productName}\n\nممكن توضحلي:\n- السعر\n- مدة التنفيذ\n- التفاصيل\n\nشكراً 🙏`
    : `Hello Picasso Masr 🎭\n\nI'd like to order: ${productName}\n\nCould you share:\n- Price\n- Lead time\n- Details\n\nThank you 🙏`
  return buildWhatsAppUrl(WHATSAPP_NUMBER, message)
}

export function getOrderStatusWhatsAppUrl(
  customerPhone: string,
  status: string,
  customerName: string,
  orderNumber: string,
): string {
  const messages: Record<string, string> = {
    confirmed:   `مرحباً ${customerName} 🎉\nتم تأكيد طلبك رقم ${orderNumber}\nهنبدأ التنفيذ قريباً وهنبعتلك تحديثات 🙏`,
    in_progress: `مرحباً ${customerName} 🔨\nطلبك رقم ${orderNumber} بدأنا فيه!\nهنوريك صور التقدم قريباً`,
    ready:       `مرحباً ${customerName} ✅\nطلبك رقم ${orderNumber} جاهز!\nهيتشحن خلال 24 ساعة`,
    shipped:     `مرحباً ${customerName} 🚀\nطلبك رقم ${orderNumber} اتشحن!\nمتوقع يوصلك خلال 2-3 أيام`,
    delivered:   `مرحباً ${customerName} 🎊\nأتمنى طلبك رقم ${orderNumber} عجبك!\nلو عندك أي ملاحظة أو صور شاركنا 📸`,
    cancelled:   `مرحباً ${customerName}\nللأسف طلبك رقم ${orderNumber} اتألغى.\nتواصل معانا عشان نساعدك بطريقة تانية`,
  }
  const message = messages[status] ?? `تحديث على طلبك رقم ${orderNumber}`
  return buildWhatsAppUrl(customerPhone, message)
}

export function getInquiryWhatsAppUrl(name: string, phone: string): string {
  return buildWhatsAppUrl(phone, `مرحباً ${name}! 👋 شايف إنك مهتم بأعمالنا. إزاي نقدر نساعدك؟`)
}
