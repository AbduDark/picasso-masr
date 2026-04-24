// ═══════════════════════════════════════════════════════
// PICASSO MASR — TypeScript Types
// ═══════════════════════════════════════════════════════

export type Language = 'ar' | 'en'

export type ProductCategory = 'helmet' | 'mask' | 'armor' | 'custom'

export type ProductSize = 'standard' | 'large' | 'custom'

export type OrderStatus =
  | 'new'
  | 'contacted'
  | 'confirmed'
  | 'in_progress'
  | 'ready'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type OrderSource = 'whatsapp' | 'form' | 'instagram'

// ─── Product ──────────────────────────────────────────
export interface Product {
  id: string
  slug: string

  // Arabic (primary)
  name_ar: string
  description_ar: string | null
  details_ar: string[] | null

  // English (secondary)
  name_en: string
  description_en: string | null
  details_en: string[] | null

  // Pricing
  price: number | null
  price_label_ar: string
  price_label_en: string

  // Media
  images: string[]
  thumbnail: string | null
  video_url: string | null

  // Categorization
  category: ProductCategory
  character: string | null
  franchise: string | null
  tags: string[]

  // Specs
  material: string
  finish: string
  size: ProductSize | null
  weight_grams: number | null
  is_wearable: boolean
  has_led: boolean

  // Availability
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  sort_order: number

  // SEO
  meta_title_ar: string | null
  meta_title_en: string | null

  // Timestamps
  created_at: string
  updated_at: string
}

// ─── Order ────────────────────────────────────────────
export interface Order {
  id: string
  order_number: string

  // Customer
  customer_name: string
  customer_phone: string
  customer_city: string | null
  customer_address: string | null

  // Order details
  product_id: string | null
  product_name: string | null
  product_price: number | null
  quantity: number
  custom_notes: string | null

  // Pricing
  subtotal: number | null
  shipping_cost: number
  total: number | null

  // Status
  status: OrderStatus
  source: OrderSource
  admin_notes: string | null
  whatsapp_message: string | null

  // Timestamps
  created_at: string
  updated_at: string
  delivered_at: string | null
}

// ─── Inquiry ──────────────────────────────────────────
export interface Inquiry {
  id: string
  name: string
  phone: string
  product_id: string | null
  product_name: string | null
  message: string | null
  is_read: boolean
  is_converted: boolean
  created_at: string
}

// ─── Gallery ──────────────────────────────────────────
export interface GalleryItem {
  id: string
  image_url: string
  caption_ar: string | null
  caption_en: string | null
  product_id: string | null
  is_featured: boolean
  sort_order: number
  created_at: string
}

// ─── Testimonial ──────────────────────────────────────
export interface Testimonial {
  id: string
  name: string
  city: string | null
  content_ar: string
  content_en: string | null
  rating: number
  product_id: string | null
  is_featured: boolean
  created_at: string
}

// ─── Site Settings ────────────────────────────────────
export interface SiteSettings {
  whatsapp_number: string
  instagram_url: string
  facebook_url: string
  tiktok_url?: string
  email?: string
  hero_title_ar: string
  hero_subtitle_ar: string
  hero_title_en: string
  hero_subtitle_en: string
  delivery_text_ar: string
}

// ─── Form Types ───────────────────────────────────────
export interface OrderFormData {
  name: string
  phone: string
  city: string
  product_interest: string
  notes: string
  contact_preference: 'whatsapp' | 'call'
}

export interface ProductFormData {
  name_ar: string
  name_en: string
  slug: string
  description_ar: string
  description_en: string
  details_ar: string
  details_en: string
  price: string
  price_label_ar: string
  price_label_en: string
  category: ProductCategory
  character: string
  franchise: string
  material: string
  finish: string
  size: ProductSize
  weight_grams: string
  is_wearable: boolean
  has_led: boolean
  is_featured: boolean
  is_new: boolean
  in_stock: boolean
  sort_order: string
  video_url: string
  meta_title_ar: string
  meta_title_en: string
}

// ─── API Responses ────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
}

// ─── UI Types ─────────────────────────────────────────
export interface NavItem {
  label_ar: string
  label_en: string
  href: string
}

export interface Stat {
  value: number
  suffix: string
  label_ar: string
  label_en: string
}

export interface ProcessStep {
  number: string
  icon: string
  title_ar: string
  title_en: string
  desc_ar: string
  desc_en: string
}
