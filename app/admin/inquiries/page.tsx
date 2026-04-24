'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare, CheckCircle, ShoppingCart, Phone, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getInquiryWhatsAppUrl } from '@/lib/whatsapp'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import toast from 'react-hot-toast'

interface Inquiry {
  id: string
  name: string
  phone: string
  product_name: string | null
  product_id: string | null
  message: string | null
  is_read: boolean
  is_converted: boolean
  created_at: string
}

export default function AdminInquiriesPage() {
  const supabase = createClient()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'new' | 'converted'>('all')

  const fetchInquiries = async () => {
    setLoading(true)
    let query = supabase.from('inquiries').select('*').order('created_at', { ascending: false })
    if (filter === 'new') query = query.eq('is_read', false)
    if (filter === 'converted') query = query.eq('is_converted', true)
    const { data } = await query
    setInquiries(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchInquiries() }, [filter])

  const markRead = async (id: string, isRead: boolean) => {
    await supabase.from('inquiries').update({ is_read: isRead }).eq('id', id)
    toast.success(isRead ? 'تم التعليم كمقروء' : 'تم التعليم كغير مقروء')
    fetchInquiries()
  }

  const markConverted = async (id: string) => {
    await supabase.from('inquiries').update({ is_converted: true, is_read: true }).eq('id', id)
    toast.success('تم تحويل الاستفسار لطلب ✅')
    fetchInquiries()
  }

  const openWhatsApp = (inquiry: Inquiry) => {
    const url = getInquiryWhatsAppUrl(inquiry.name, inquiry.phone)
    window.open(url, '_blank')
  }

  const newCount = inquiries.filter(i => !i.is_read).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-ar font-black text-2xl text-text-cream">الاستفسارات</h1>
          <p className="font-ar text-text-muted text-sm mt-1">
            {inquiries.length} استفسار
            {newCount > 0 && <span className="text-gold-pure mr-2">({newCount} جديد)</span>}
          </p>
        </div>
        <button onClick={fetchInquiries} className="flex items-center gap-2 text-gold-pure border border-gold/30 px-4 py-2 rounded-lg font-ar text-sm hover:bg-gold-pure/10 transition-colors cursor-pointer">
          <RefreshCw size={16} />
          تحديث
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2">
        {[
          { key: 'all' as const, label: 'الكل' },
          { key: 'new' as const, label: 'جديد' },
          { key: 'converted' as const, label: 'محوّل لطلب' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-ar font-semibold border transition-all cursor-pointer ${
              filter === f.key ? 'bg-gold-pure/15 border-gold-pure/60 text-gold-pure' : 'border-white/10 text-text-secondary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-luxury p-6"><Skeleton className="h-16 w-full" /></div>
          ))
        ) : inquiries.length === 0 ? (
          <div className="card-luxury p-12 text-center">
            <MessageSquare size={40} className="mx-auto mb-3 text-text-muted opacity-30" />
            <p className="font-ar text-text-muted">لا توجد استفسارات</p>
          </div>
        ) : (
          inquiries.map(inquiry => (
            <div
              key={inquiry.id}
              className={`card-luxury p-5 transition-all ${
                !inquiry.is_read ? 'border-gold-pure/40 bg-gold-pure/[0.03]' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-ar font-bold text-text-cream">{inquiry.name}</h3>
                    {!inquiry.is_read && <Badge variant="gold">جديد</Badge>}
                    {inquiry.is_converted && <Badge variant="green">محوّل لطلب</Badge>}
                  </div>
                  <p className="font-body-en text-text-muted text-sm" dir="ltr">{inquiry.phone}</p>
                  {inquiry.product_name && (
                    <p className="font-ar text-gold-muted text-sm mt-1">المنتج: {inquiry.product_name}</p>
                  )}
                  {inquiry.message && (
                    <p className="font-ar text-text-secondary text-sm mt-2 bg-bg-surface/40 rounded-lg px-3 py-2">
                      {inquiry.message}
                    </p>
                  )}
                  <p className="font-ar text-text-muted text-xs mt-2">{formatDate(inquiry.created_at, 'ar')}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openWhatsApp(inquiry)} title="تواصل واتساب"
                    className="p-2.5 rounded-lg bg-whatsapp/10 border border-whatsapp/20 text-whatsapp-light hover:bg-whatsapp/20 transition-colors cursor-pointer">
                    <Phone size={16} />
                  </button>

                  <button onClick={() => markRead(inquiry.id, !inquiry.is_read)} title={inquiry.is_read ? 'تعليم كغير مقروء' : 'تعليم كمقروء'}
                    className="p-2.5 rounded-lg border border-white/10 text-text-muted hover:text-gold-pure hover:border-gold/30 transition-colors cursor-pointer">
                    {inquiry.is_read ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>

                  {!inquiry.is_converted && (
                    <button onClick={() => markConverted(inquiry.id)} title="تحويل لطلب"
                      className="p-2.5 rounded-lg bg-gold-pure/10 border border-gold/30 text-gold-pure hover:bg-gold-pure/20 transition-colors cursor-pointer">
                      <ShoppingCart size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
