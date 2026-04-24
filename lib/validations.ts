import { z } from 'zod'

// ─── Order Form ───────────────────────────────────────
export const orderFormSchema = z.object({
  name: z.string().min(2, 'الاسم لازم يكون حرفين على الأقل'),
  phone: z
    .string()
    .regex(/^(01)[0125][0-9]{8}$/, 'رقم تليفون مصري مش صح — مثال: 01012345678'),
  city: z.string().min(2, 'اختار المحافظة'),
  product_interest: z.string().min(1, 'اكتب المنتج اللي عايزه'),
  notes: z.string().optional(),
  contact_preference: z.enum(['whatsapp', 'call']).default('whatsapp'),
})

export type OrderFormData = z.infer<typeof orderFormSchema>

// ─── Product Form ─────────────────────────────────────
export const productFormSchema = z.object({
  name_ar: z.string().min(2, 'الاسم بالعربي مطلوب'),
  name_en: z.string().min(2, 'English name is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only'),
  description_ar: z.string().min(10, 'وصف قصير مطلوب'),
  description_en: z.string().optional(),
  details_ar: z.string().optional(),
  details_en: z.string().optional(),
  price: z.string().optional(),
  price_label_ar: z.string().default('تواصل معنا للسعر'),
  price_label_en: z.string().default('Contact us for pricing'),
  category: z.enum(['helmet', 'mask', 'armor', 'custom']),
  character: z.string().optional(),
  franchise: z.string().optional(),
  material: z.string().default('Resin Premium'),
  finish: z.string().default('Hand-painted & sealed'),
  size: z.enum(['standard', 'large', 'custom']).default('standard'),
  weight_grams: z.string().optional(),
  is_wearable: z.boolean().default(true),
  has_led: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(true),
  in_stock: z.boolean().default(true),
  sort_order: z.string().default('0'),
  video_url: z.string().url().optional().or(z.literal('')),
  meta_title_ar: z.string().optional(),
  meta_title_en: z.string().optional(),
})

export type ProductFormSchema = z.infer<typeof productFormSchema>

// ─── Admin Login ──────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('ايميل مش صح'),
  password: z.string().min(6, 'الباسورد لازم يكون 6 أحرف على الأقل'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// ─── Settings ─────────────────────────────────────────
export const settingsSchema = z.object({
  whatsapp_number: z.string().regex(/^\d{10,15}$/, 'رقم واتساب مش صح'),
  instagram_url: z.string().url().optional().or(z.literal('')),
  facebook_url: z.string().url().optional().or(z.literal('')),
  tiktok_url: z.string().url().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  hero_title_ar: z.string().min(3),
  hero_subtitle_ar: z.string().min(10),
  hero_title_en: z.string().min(3),
  hero_subtitle_en: z.string().min(10),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
