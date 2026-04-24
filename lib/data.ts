/**
 * lib/data.ts
 * Server-side data fetching functions using Supabase.
 * These run on the server (RSC / Server Actions) — never on the client.
 */

import { createClient } from '@/lib/supabase/server'
import { SEED_PRODUCTS, SEED_TESTIMONIALS } from '@/lib/constants'

// ─── Types ────────────────────────────────────────────
export interface DBProduct {
  id: string
  slug: string
  name_ar: string
  name_en: string
  description_ar: string | null
  description_en: string | null
  price: number | null
  price_label_ar: string | null
  price_label_en: string | null
  category: string
  character: string | null
  franchise: string | null
  material: string | null
  finish: string | null
  images: string[]
  thumbnail: string | null
  has_led: boolean
  is_wearable: boolean
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  sort_order: number
  tags: string[]
  created_at: string
}

export interface DBTestimonial {
  id: string
  name: string
  city: string | null
  content_ar: string
  content_en: string | null
  rating: number
  is_featured: boolean
  created_at: string
}

export interface DBGalleryItem {
  id: string
  image_url: string
  caption_ar: string | null
  caption_en: string | null
  is_featured: boolean
  sort_order: number
}

// ─── Featured Products (homepage) ────────────────────
export async function getFeaturedProducts(): Promise<DBProduct[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('in_stock', true)
      .order('sort_order')
      .order('created_at', { ascending: false })
      .limit(6)

    if (error || !data || data.length === 0) {
      // Fallback to seed data if DB is empty
      return SEED_PRODUCTS.filter(p => p.is_featured).slice(0, 6) as unknown as DBProduct[]
    }
    return data
  } catch {
    return SEED_PRODUCTS.filter(p => p.is_featured).slice(0, 6) as unknown as DBProduct[]
  }
}

// ─── All Products ─────────────────────────────────────
export async function getAllProducts(category?: string): Promise<DBProduct[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('products')
      .select('*')
      .order('sort_order')
      .order('created_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error || !data || data.length === 0) {
      return SEED_PRODUCTS as unknown as DBProduct[]
    }
    return data
  } catch {
    return SEED_PRODUCTS as unknown as DBProduct[]
  }
}

// ─── Single Product by Slug ───────────────────────────
export async function getProductBySlug(slug: string): Promise<DBProduct | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      // Fallback to seed
      const seed = SEED_PRODUCTS.find(p => p.slug === slug)
      return seed as unknown as DBProduct | null
    }
    return data
  } catch {
    const seed = SEED_PRODUCTS.find(p => p.slug === slug)
    return seed as unknown as DBProduct | null
  }
}

// ─── Testimonials (homepage) ──────────────────────────
export async function getFeaturedTestimonials(): Promise<DBTestimonial[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error || !data || data.length === 0) {
      return SEED_TESTIMONIALS as unknown as DBTestimonial[]
    }
    return data
  } catch {
    return SEED_TESTIMONIALS as unknown as DBTestimonial[]
  }
}

// ─── Gallery Items (homepage) ─────────────────────────
export async function getGalleryItems(limit = 9): Promise<DBGalleryItem[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('sort_order')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !data || data.length === 0) {
      return [] // No static fallback for gallery
    }
    return data
  } catch {
    return []
  }
}

// ─── Dashboard Stats ──────────────────────────────────
export async function getDashboardStats() {
  try {
    const supabase = await createClient()

    const [
      { count: totalOrders },
      { data: orders },
      { count: newInquiries },
      { count: totalProducts },
    ] = await Promise.all([
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase
        .from('orders')
        .select('status, total, created_at')
        .order('created_at', { ascending: false })
        .limit(50),
      supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('is_read', false),
      supabase.from('products').select('id', { count: 'exact', head: true }),
    ])

    const pending = orders?.filter(o =>
      ['new', 'contacted', 'confirmed', 'in_progress'].includes(o.status)
    ).length ?? 0

    const revenue = orders
      ?.filter(o => o.status === 'delivered')
      .reduce((acc, o) => acc + (o.total ?? 0), 0) ?? 0

    return {
      totalOrders: totalOrders ?? 0,
      pendingOrders: pending,
      newInquiries: newInquiries ?? 0,
      totalProducts: totalProducts ?? 0,
      totalRevenue: revenue,
    }
  } catch {
    return {
      totalOrders: 0,
      pendingOrders: 0,
      newInquiries: 0,
      totalProducts: 0,
      totalRevenue: 0,
    }
  }
}
