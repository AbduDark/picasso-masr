import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductBySlug, getAllProducts } from '@/lib/data'
import ProductDetailClient from './ProductDetailClient'

interface PageProps {
  params: { slug: string }
}

// Generate static params from all products
export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return {}
  return {
    title: `${product.name_ar} | بيكاسو مصر`,
    description: product.description_ar ?? undefined,
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  // Fetch related products (same category, exclude current)
  const allProducts = await getAllProducts(product.category)
  let related = allProducts.filter(p => p.slug !== product.slug).slice(0, 4)

  // If not enough related products in the same category, get from all categories
  if (related.length < 4) {
    const all = await getAllProducts()
    const more = all.filter(p => p.slug !== product.slug && !related.find(r => r.id === p.id)).slice(0, 4 - related.length)
    related = [...related, ...more]
  }

  return <ProductDetailClient product={product} relatedProducts={related} />
}
