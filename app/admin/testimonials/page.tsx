'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Star, StarOff, RefreshCw, Quote } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import Modal from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import toast from 'react-hot-toast'

interface Testimonial {
  id: string
  name: string
  city: string | null
  content_ar: string
  content_en: string | null
  rating: number
  is_featured: boolean
  created_at: string
}

const EMPTY_FORM = {
  name: '',
  city: '',
  content_ar: '',
  content_en: '',
  rating: 5,
  is_featured: true,
}

export default function AdminTestimonialsPage() {
  const supabase = createClient()
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const fetchItems = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (item: Testimonial) => {
    setEditing(item)
    setForm({
      name: item.name,
      city: item.city || '',
      content_ar: item.content_ar,
      content_en: item.content_en || '',
      rating: item.rating,
      is_featured: item.is_featured,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.content_ar) {
      toast.error('الاسم والمحتوى بالعربي مطلوبان')
      return
    }
    setSaving(true)

    const payload = {
      name: form.name,
      city: form.city || null,
      content_ar: form.content_ar,
      content_en: form.content_en || null,
      rating: form.rating,
      is_featured: form.is_featured,
    }

    if (editing) {
      const { error } = await supabase.from('testimonials').update(payload).eq('id', editing.id)
      if (error) toast.error('خطأ في التحديث: ' + error.message)
      else toast.success('تم التحديث ✅')
    } else {
      const { error } = await supabase.from('testimonials').insert(payload)
      if (error) toast.error('خطأ في الإضافة: ' + error.message)
      else toast.success('تمت إضافة الرأي ✅')
    }

    setSaving(false)
    setModalOpen(false)
    fetchItems()
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) toast.error('خطأ في الحذف')
    else { toast.success('تم الحذف'); fetchItems() }
    setDeleteConfirm(null)
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('testimonials').update({ is_featured: !current }).eq('id', id)
    toast.success(!current ? 'تم التمييز' : 'تم إزالة التمييز')
    fetchItems()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-ar font-black text-2xl text-text-cream">آراء العملاء</h1>
          <p className="font-ar text-text-muted text-sm mt-1">{items.length} رأي</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchItems} className="flex items-center gap-2 text-text-secondary border border-white/10 px-4 py-2 rounded-lg font-ar text-sm hover:bg-white/5 transition-colors cursor-pointer">
            <RefreshCw size={16} /> تحديث
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 bg-gold-pure/15 border border-gold-pure/40 text-gold-pure px-5 py-2.5 rounded-xl font-ar font-bold text-sm hover:bg-gold-pure/25 transition-colors cursor-pointer">
            <Plus size={18} /> إضافة رأي
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card-luxury p-16 text-center">
          <Quote size={48} className="mx-auto mb-4 text-text-muted opacity-30" />
          <p className="font-ar text-text-muted text-lg">لا توجد آراء بعد</p>
          <p className="font-ar text-text-muted text-sm mt-1">اضغط &ldquo;إضافة رأي&rdquo; للبدء</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="card-luxury p-6 relative group">
              {/* Featured badge */}
              <div className="absolute top-4 left-4">
                {item.is_featured
                  ? <Badge variant="gold">مميز</Badge>
                  : <Badge variant="silver">غير مميز</Badge>
                }
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < item.rating ? 'fill-gold-pure text-gold-pure' : 'text-gold-muted/30'}
                  />
                ))}
              </div>

              {/* Content */}
              <blockquote className="font-ar text-text-secondary text-sm leading-relaxed mb-4 line-clamp-3 italic">
                &ldquo;{item.content_ar}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-ar font-bold text-text-cream text-sm">{item.name}</p>
                  {item.city && <p className="font-ar text-text-muted text-xs">{item.city}</p>}
                </div>
                <p className="font-ar text-text-muted text-xs">{formatDate(item.created_at, 'ar')}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                <button
                  onClick={() => toggleFeatured(item.id, item.is_featured)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-ar border border-white/10 text-text-secondary hover:text-gold-pure hover:border-gold/30 transition-all cursor-pointer"
                >
                  {item.is_featured ? <StarOff size={14} /> : <Star size={14} />}
                  {item.is_featured ? 'إزالة التمييز' : 'تمييز'}
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-ar border border-white/10 text-text-secondary hover:text-gold-pure hover:border-gold/30 transition-all cursor-pointer"
                >
                  <Pencil size={14} /> تعديل
                </button>
                <button
                  onClick={() => setDeleteConfirm(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-ar border border-white/10 text-text-secondary hover:text-red-400 hover:border-red-400/30 transition-all cursor-pointer mr-auto"
                >
                  <Trash2 size={14} /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'تعديل الرأي' : 'إضافة رأي جديد'} size="lg">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="اسم العميل *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="المدينة" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="القاهرة" />
          </div>

          <Textarea label="الرأي بالعربي *" value={form.content_ar} onChange={e => setForm(f => ({ ...f, content_ar: e.target.value }))} rows={3} />
          <Textarea label="الرأي بالإنجليزي (اختياري)" value={form.content_en} onChange={e => setForm(f => ({ ...f, content_en: e.target.value }))} rows={3} dir="ltr" />

          {/* Rating */}
          <div>
            <label className="block font-ar text-sm text-text-secondary mb-2">التقييم</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setForm(f => ({ ...f, rating: n }))}
                  className="cursor-pointer"
                  aria-label={`${n} نجوم`}
                >
                  <Star
                    size={28}
                    className={n <= form.rating ? 'fill-gold-pure text-gold-pure' : 'text-gold-muted/30 hover:text-gold-muted'}
                  />
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-white/5 hover:border-gold/20 transition-colors">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
              className="accent-gold-pure w-4 h-4"
            />
            <span className="font-ar text-text-secondary text-sm">عرض على الصفحة الرئيسية</span>
          </label>

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button onClick={handleSave} disabled={saving} className="flex-1 bg-gold-pure text-bg-void py-3 rounded-xl font-ar font-bold hover:bg-gold-light transition-colors cursor-pointer disabled:opacity-50">
              {saving ? 'جاري الحفظ...' : (editing ? 'تحديث الرأي' : 'إضافة الرأي')}
            </button>
            <button onClick={() => setModalOpen(false)} className="px-6 py-3 border border-white/10 rounded-xl font-ar text-text-secondary hover:bg-white/5 transition-colors cursor-pointer">
              إلغاء
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="تأكيد الحذف" size="sm">
        <p className="font-ar text-text-secondary mb-6">هل أنت متأكد من حذف هذا الرأي؟</p>
        <div className="flex gap-3">
          <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-ar font-bold hover:bg-red-600 transition-colors cursor-pointer">حذف</button>
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-white/10 py-3 rounded-xl font-ar text-text-secondary hover:bg-white/5 transition-colors cursor-pointer">إلغاء</button>
        </div>
      </Modal>
    </div>
  )
}
