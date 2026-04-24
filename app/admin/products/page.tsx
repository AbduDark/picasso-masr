'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Search, Package, Upload } from 'lucide-react'
import { formatPrice, formatDate, getProductPlaceholder } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import Modal from '@/components/ui/Modal'
import { Input, Textarea, Select } from '@/components/ui/Input'
import toast from 'react-hot-toast'
import { PRODUCT_CATEGORIES } from '@/lib/constants'

interface Product {
  id: string
  slug: string
  name_ar: string
  name_en: string
  description_ar: string
  description_en: string
  price: number | null
  category: string
  character: string | null
  franchise: string | null
  material: string
  finish: string
  is_wearable: boolean
  has_led: boolean
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  sort_order: number
  images: string[]
  thumbnail: string | null
  created_at: string
}

const EMPTY_PRODUCT = {
  slug: '',
  name_ar: '',
  name_en: '',
  description_ar: '',
  description_en: '',
  price: '',
  category: 'mask',
  character: '',
  franchise: '',
  material: 'Resin Premium',
  finish: 'Hand-painted & sealed',
  is_wearable: true,
  has_led: false,
  in_stock: true,
  is_featured: false,
  is_new: true,
  sort_order: 0,
}

export default function AdminProductsPage() {
  const supabase = createClient()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [thumbFile, setThumbFile] = useState<File | null>(null)
  const [thumbPreview, setThumbPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const uploadThumbnail = async (file: File): Promise<string | null> => {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(filename, file, { cacheControl: '3600', upsert: false })
    if (error) { toast.error('خطأ في رفع الصورة: ' + error.message); setUploading(false); return null }
    const { data } = supabase.storage.from('product-images').getPublicUrl(filename)
    setUploading(false)
    return data.publicUrl
  }

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase.from('products').select('*').order('sort_order').order('created_at', { ascending: false })
    if (filterCat !== 'all') query = query.eq('category', filterCat)
    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [filterCat])

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    return p.name_ar.toLowerCase().includes(q) || p.name_en.toLowerCase().includes(q) || p.slug.includes(q)
  })

  const openCreate = () => {
    setEditingProduct(null)
    setForm(EMPTY_PRODUCT)
    setThumbFile(null)
    setThumbPreview(null)
    setModalOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setForm({
      slug: product.slug,
      name_ar: product.name_ar,
      name_en: product.name_en,
      description_ar: product.description_ar || '',
      description_en: product.description_en || '',
      price: product.price?.toString() || '',
      category: product.category,
      character: product.character || '',
      franchise: product.franchise || '',
      material: product.material || 'Resin Premium',
      finish: product.finish || 'Hand-painted & sealed',
      is_wearable: product.is_wearable,
      has_led: product.has_led,
      in_stock: product.in_stock,
      is_featured: product.is_featured,
      is_new: product.is_new,
      sort_order: product.sort_order,
    })
    setThumbFile(null)
    setThumbPreview(product.thumbnail || null)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name_ar || !form.name_en || !form.slug) {
      toast.error('الاسم بالعربي والإنجليزي و الـ slug مطلوبين')
      return
    }
    setSaving(true)

    // Upload thumbnail if a new file was selected
    let thumbnailUrl: string | null = editingProduct?.thumbnail ?? null
    if (thumbFile) {
      const uploaded = await uploadThumbnail(thumbFile)
      if (uploaded) thumbnailUrl = uploaded
    }

    const payload = {
      slug: form.slug,
      name_ar: form.name_ar,
      name_en: form.name_en,
      description_ar: form.description_ar,
      description_en: form.description_en,
      price: form.price ? parseFloat(form.price) : null,
      category: form.category,
      character: form.character || null,
      franchise: form.franchise || null,
      material: form.material,
      finish: form.finish,
      is_wearable: form.is_wearable,
      has_led: form.has_led,
      in_stock: form.in_stock,
      is_featured: form.is_featured,
      is_new: form.is_new,
      sort_order: form.sort_order,
      ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {}),
    }

    if (editingProduct) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id)
      if (error) { toast.error('خطأ في التحديث: ' + error.message) }
      else { toast.success('تم تحديث المنتج ✅') }
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if (error) { toast.error('خطأ في الإضافة: ' + error.message) }
      else { toast.success('تم إضافة المنتج ✅') }
    }

    setSaving(false)
    setModalOpen(false)
    setThumbFile(null)
    setThumbPreview(null)
    fetchProducts()
  }


  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) toast.error('خطأ في الحذف')
    else { toast.success('تم حذف المنتج'); fetchProducts() }
    setDeleteConfirm(null)
  }

  const toggleField = async (id: string, field: string, current: boolean) => {
    await supabase.from('products').update({ [field]: !current }).eq('id', id)
    fetchProducts()
  }

  const catOptions = PRODUCT_CATEGORIES.filter(c => c.value !== 'all').map(c => ({ value: c.value, label: c.label_ar }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-ar font-black text-2xl text-text-cream">إدارة المنتجات</h1>
          <p className="font-ar text-text-muted text-sm mt-1">{products.length} منتج</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-gold-pure/15 border border-gold-pure/40 text-gold-pure px-5 py-2.5 rounded-xl font-ar font-bold text-sm hover:bg-gold-pure/25 transition-colors cursor-pointer">
          <Plus size={18} />
          إضافة منتج جديد
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-4 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث بالاسم أو slug..." className="input-luxury font-ar pr-10 w-full" />
        </div>
        <div className="flex gap-2">
          {PRODUCT_CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => setFilterCat(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-ar font-semibold border transition-all cursor-pointer ${
                filterCat === cat.value ? 'bg-gold-pure/15 border-gold-pure/60 text-gold-pure' : 'border-white/10 text-text-secondary hover:border-gold/30'
              }`}
            >
              {cat.label_ar}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right font-ar text-sm">
            <thead className="bg-white/5 text-text-muted border-b border-white/5">
              <tr>
                <th className="p-4 font-semibold w-12">#</th>
                <th className="p-4 font-semibold">المنتج</th>
                <th className="p-4 font-semibold">الفئة</th>
                <th className="p-4 font-semibold">السعر</th>
                <th className="p-4 font-semibold">الحالة</th>
                <th className="p-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td className="p-4" colSpan={6}><Skeleton className="h-12 w-full" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-text-muted">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  لا توجد منتجات
                </td></tr>
              ) : (
                filtered.map((product, i) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-text-muted">{i + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 relative">
                          <Image src={product.thumbnail || getProductPlaceholder(i)} alt="" fill className="object-cover" sizes="48px" />
                        </div>
                        <div>
                          <p className="font-bold text-text-cream leading-tight">{product.name_ar}</p>
                          <p className="text-xs text-text-muted font-body-en">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="silver">{product.category}</Badge>
                    </td>
                    <td className="p-4 text-gold-pure font-bold">
                      {formatPrice(product.price, 'ar')}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {product.in_stock ? <Badge variant="green">متاح</Badge> : <Badge variant="red">نفذ</Badge>}
                        {product.is_featured && <Badge variant="gold">مميز</Badge>}
                        {product.is_new && <Badge variant="blue">جديد</Badge>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(product)} className="p-2 rounded-lg text-text-muted hover:text-gold-pure hover:bg-gold-pure/10 transition-all cursor-pointer" title="تعديل">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirm(product.id)} className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer" title="حذف">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setThumbFile(null); setThumbPreview(null) }} title={editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'} size="xl">
        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="الاسم بالعربي *" value={form.name_ar} onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))} required />
            <Input label="الاسم بالإنجليزي *" value={form.name_en} onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))} dir="ltr" required />
          </div>
          <Input label="Slug *" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} dir="ltr" placeholder="optimus-prime-helmet" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea label="الوصف بالعربي" value={form.description_ar} onChange={e => setForm(f => ({ ...f, description_ar: e.target.value }))} rows={3} />
            <Textarea label="الوصف بالإنجليزي" value={form.description_en} onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))} dir="ltr" rows={3} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="السعر (جنيه)" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} type="number" dir="ltr" placeholder="اتركه فارغ = تواصل للسعر" />
            <Select label="الفئة" value={form.category} options={catOptions} onChange={e => setForm(f => ({ ...f, category: (e.target as HTMLSelectElement).value }))} />
            <Input label="ترتيب العرض" value={form.sort_order.toString()} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} type="number" dir="ltr" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="الشخصية" value={form.character} onChange={e => setForm(f => ({ ...f, character: e.target.value }))} placeholder="Optimus Prime" dir="ltr" />
            <Input label="الامتياز" value={form.franchise} onChange={e => setForm(f => ({ ...f, franchise: e.target.value }))} placeholder="Transformers" dir="ltr" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="المادة" value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} />
            <Input label="التشطيب" value={form.finish} onChange={e => setForm(f => ({ ...f, finish: e.target.value }))} />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block font-ar text-sm text-text-secondary mb-2">صورة المنتج (Thumbnail)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0]
                if (!file) return
                setThumbFile(file)
                setThumbPreview(URL.createObjectURL(file))
              }}
            />
            <div className="flex gap-3 items-start">
              {(thumbPreview || editingProduct?.thumbnail) && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gold/20 shrink-0">
                  <Image
                    src={thumbPreview || editingProduct?.thumbnail || ''}
                    alt="thumbnail"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-gold/30 rounded-lg text-text-secondary hover:text-gold-pure hover:border-gold/60 transition-all cursor-pointer font-ar text-sm"
              >
                <Upload size={16} />
                {thumbPreview || editingProduct?.thumbnail ? 'تغيير الصورة' : 'رفع صورة'}
              </button>
              {uploading && <span className="font-ar text-xs text-gold-muted self-center">جاري الرفع...</span>}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {([
              ['is_wearable', 'قابل للارتداء'],
              ['has_led', 'يحتوي LED'],
              ['in_stock', 'متاح في المخزون'],
              ['is_featured', 'مميز'],
              ['is_new', 'جديد'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-white/5 hover:border-gold/20 transition-colors">
                <input type="checkbox" checked={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} className="accent-gold-pure w-4 h-4" />
                <span className="font-ar text-text-secondary text-sm">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button onClick={handleSave} disabled={saving || uploading} className="flex-1 bg-gold-pure text-bg-void py-3 rounded-xl font-ar font-bold hover:bg-gold-light transition-colors cursor-pointer disabled:opacity-50">
              {uploading ? 'جاري رفع الصورة...' : saving ? 'جاري الحفظ...' : (editingProduct ? 'تحديث المنتج' : 'إضافة المنتج')}
            </button>
            <button onClick={() => { setModalOpen(false); setThumbFile(null); setThumbPreview(null) }} className="px-6 py-3 border border-white/10 rounded-xl font-ar text-text-secondary hover:bg-white/5 transition-colors cursor-pointer">
              إلغاء
            </button>
          </div>
        </div>
      </Modal>


      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="تأكيد الحذف" size="sm">
        <p className="font-ar text-text-secondary mb-6">هل أنت متأكد من حذف هذا المنتج؟ هذا الإجراء لا يمكن التراجع عنه.</p>
        <div className="flex gap-3">
          <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-ar font-bold hover:bg-red-600 transition-colors cursor-pointer">
            حذف
          </button>
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-white/10 py-3 rounded-xl font-ar text-text-secondary hover:bg-white/5 transition-colors cursor-pointer">
            إلغاء
          </button>
        </div>
      </Modal>
    </div>
  )
}
