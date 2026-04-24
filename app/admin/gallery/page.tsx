'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Star, StarOff, RefreshCw, ImageIcon, Upload, Link2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import Modal from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import toast from 'react-hot-toast'

interface GalleryItem {
  id: string
  image_url: string
  caption_ar: string | null
  caption_en: string | null
  is_featured: boolean
  sort_order: number
  created_at: string
}

type UploadMode = 'upload' | 'url'

export default function AdminGalleryPage() {
  const supabase = createClient()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [uploadMode, setUploadMode] = useState<UploadMode>('upload')
  const [form, setForm] = useState({
    image_url: '',
    caption_ar: '',
    caption_en: '',
    is_featured: false,
    sort_order: 0,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchGallery = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('sort_order')
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchGallery() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const resetModal = () => {
    setForm({ image_url: '', caption_ar: '', caption_en: '', is_featured: false, sort_order: 0 })
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadMode('upload')
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  // Upload file to Supabase Storage and return public URL
  const uploadToStorage = async (file: File): Promise<string | null> => {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error } = await supabase.storage
      .from('gallery')
      .upload(filename, file, { cacheControl: '3600', upsert: false })

    if (error) {
      toast.error('خطأ في رفع الصورة: ' + error.message)
      setUploading(false)
      return null
    }

    const { data } = supabase.storage.from('gallery').getPublicUrl(filename)
    setUploading(false)
    return data.publicUrl
  }

  const handleAdd = async () => {
    setSaving(true)
    let finalUrl = form.image_url

    if (uploadMode === 'upload') {
      if (!selectedFile) { toast.error('اختر صورة للرفع'); setSaving(false); return }
      const uploaded = await uploadToStorage(selectedFile)
      if (!uploaded) { setSaving(false); return }
      finalUrl = uploaded
    } else {
      if (!finalUrl) { toast.error('رابط الصورة مطلوب'); setSaving(false); return }
    }

    const { error } = await supabase.from('gallery').insert({
      image_url: finalUrl,
      caption_ar: form.caption_ar || null,
      caption_en: form.caption_en || null,
      is_featured: form.is_featured,
      sort_order: form.sort_order,
    })

    if (error) toast.error('خطأ: ' + error.message)
    else {
      toast.success('تمت الإضافة ✅')
      setModalOpen(false)
      resetModal()
    }

    setSaving(false)
    fetchGallery()
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('gallery').update({ is_featured: !current }).eq('id', id)
    toast.success(!current ? 'تم تمييز الصورة' : 'تم إزالة التمييز')
    fetchGallery()
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) toast.error('خطأ في الحذف')
    else { toast.success('تم الحذف'); fetchGallery() }
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-ar font-black text-2xl text-text-cream">معرض الصور</h1>
          <p className="font-ar text-text-muted text-sm mt-1">{items.length} صورة</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchGallery} className="flex items-center gap-2 text-text-secondary border border-white/10 px-4 py-2 rounded-lg font-ar text-sm hover:bg-white/5 transition-colors cursor-pointer">
            <RefreshCw size={16} /> تحديث
          </button>
          <button
            onClick={() => { resetModal(); setModalOpen(true) }}
            className="flex items-center gap-2 bg-gold-pure/15 border border-gold-pure/40 text-gold-pure px-5 py-2 rounded-lg font-ar font-bold text-sm hover:bg-gold-pure/25 transition-colors cursor-pointer"
          >
            <Plus size={18} /> إضافة صورة
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card-luxury p-16 text-center">
          <ImageIcon size={48} className="mx-auto mb-4 text-text-muted opacity-30" />
          <p className="font-ar text-text-muted text-lg">لا توجد صور في المعرض</p>
          <p className="font-ar text-text-muted text-sm mt-1">اضغط &ldquo;إضافة صورة&rdquo; للبدء</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all">
              <div className="relative aspect-square">
                <Image
                  src={item.image_url}
                  alt={item.caption_ar || 'صورة من المعرض'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-void/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  {item.caption_ar && <p className="font-ar text-text-cream text-sm font-bold">{item.caption_ar}</p>}
                  <p className="font-ar text-text-muted text-xs mt-1">{formatDate(item.created_at, 'ar')}</p>
                </div>

                {/* Featured badge */}
                {item.is_featured && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="gold">مميز</Badge>
                  </div>
                )}

                {/* Actions */}
                <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleFeatured(item.id, item.is_featured)}
                    className="p-1.5 rounded-lg bg-bg-void/80 text-gold-pure hover:bg-gold-pure/20 transition-colors cursor-pointer"
                    title={item.is_featured ? 'إزالة التمييز' : 'تمييز'}
                  >
                    {item.is_featured ? <StarOff size={14} /> : <Star size={14} />}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item.id)}
                    className="p-1.5 rounded-lg bg-bg-void/80 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetModal() }} title="إضافة صورة جديدة" size="md">
        <div className="space-y-4">

          {/* Upload Mode Toggle */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
            <button
              onClick={() => setUploadMode('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-ar text-sm font-semibold transition-all cursor-pointer ${
                uploadMode === 'upload' ? 'bg-gold-pure/20 text-gold-pure border border-gold-pure/30' : 'text-text-secondary hover:text-text-cream'
              }`}
            >
              <Upload size={16} /> رفع صورة
            </button>
            <button
              onClick={() => setUploadMode('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-ar text-sm font-semibold transition-all cursor-pointer ${
                uploadMode === 'url' ? 'bg-gold-pure/20 text-gold-pure border border-gold-pure/30' : 'text-text-secondary hover:text-text-cream'
              }`}
            >
              <Link2 size={16} /> رابط URL
            </button>
          </div>

          {uploadMode === 'upload' ? (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-gold/20 hover:border-gold/50 rounded-xl p-8 text-center transition-colors cursor-pointer group"
              >
                {previewUrl ? (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                    <Image src={previewUrl} alt="معاينة" fill className="object-cover" sizes="400px" />
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="mx-auto mb-2 text-text-muted group-hover:text-gold-pure transition-colors" />
                    <p className="font-ar text-text-muted text-sm group-hover:text-text-secondary transition-colors">
                      اضغط لاختيار صورة أو اسحبها هنا
                    </p>
                    <p className="font-ar text-text-muted/60 text-xs mt-1">JPG, PNG, WebP — حتى 10MB</p>
                  </>
                )}
              </button>
              {previewUrl && (
                <button
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); if (fileRef.current) fileRef.current.value = '' }}
                  className="mt-2 text-xs font-ar text-text-muted hover:text-red-400 cursor-pointer"
                >
                  × إزالة الصورة
                </button>
              )}
            </div>
          ) : (
            <>
              <Input
                label="رابط الصورة *"
                value={form.image_url}
                onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                dir="ltr"
                placeholder="https://..."
              />
              {form.image_url && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10">
                  <Image src={form.image_url} alt="معاينة" fill className="object-cover" sizes="400px" />
                </div>
              )}
            </>
          )}

          <Input label="عنوان بالعربي" value={form.caption_ar} onChange={e => setForm(f => ({ ...f, caption_ar: e.target.value }))} />
          <Input label="عنوان بالإنجليزي" value={form.caption_en} onChange={e => setForm(f => ({ ...f, caption_en: e.target.value }))} dir="ltr" />
          <Input label="ترتيب العرض" value={form.sort_order.toString()} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} type="number" dir="ltr" />

          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-white/5 hover:border-gold/20 transition-colors">
            <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="accent-gold-pure w-4 h-4" />
            <span className="font-ar text-text-secondary text-sm">صورة مميزة</span>
          </label>

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button
              onClick={handleAdd}
              disabled={saving || uploading}
              className="flex-1 bg-gold-pure text-bg-void py-3 rounded-xl font-ar font-bold hover:bg-gold-light transition-colors cursor-pointer disabled:opacity-50"
            >
              {uploading ? 'جاري الرفع...' : saving ? 'جاري الحفظ...' : 'إضافة الصورة'}
            </button>
            <button onClick={() => { setModalOpen(false); resetModal() }} className="px-6 py-3 border border-white/10 rounded-xl font-ar text-text-secondary hover:bg-white/5 transition-colors cursor-pointer">
              إلغاء
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="تأكيد الحذف" size="sm">
        <p className="font-ar text-text-secondary mb-6">هل أنت متأكد من حذف هذه الصورة؟</p>
        <div className="flex gap-3">
          <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-ar font-bold hover:bg-red-600 transition-colors cursor-pointer">حذف</button>
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-white/10 py-3 rounded-xl font-ar text-text-secondary hover:bg-white/5 transition-colors cursor-pointer">إلغاء</button>
        </div>
      </Modal>
    </div>
  )
}
