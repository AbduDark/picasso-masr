'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, MessageCircle, Filter, CheckCircle, RefreshCw, ShoppingCart } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getOrderStatusWhatsAppUrl } from '@/lib/whatsapp'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import Modal from '@/components/ui/Modal'
import { Textarea } from '@/components/ui/Input'
import toast from 'react-hot-toast'
import { ORDER_STATUSES } from '@/lib/constants'

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_city: string | null
  product_name: string | null
  product_price: number | null
  quantity: number
  custom_notes: string | null
  subtotal: number | null
  shipping_cost: number | null
  total: number | null
  status: string
  source: string
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export default function AdminOrdersPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  const fetchOrders = async () => {
    setLoading(true)
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (filterStatus !== 'all') query = query.eq('status', filterStatus)
    const { data } = await query
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [filterStatus])

  const filtered = orders.filter(o => {
    const q = search.toLowerCase()
    return o.customer_name.toLowerCase().includes(q) ||
      (o.order_number || '').toLowerCase().includes(q) ||
      (o.customer_phone || '').includes(q)
  })

  const updateStatus = async (orderId: string, newStatus: string) => {
    const updates: Record<string, unknown> = { status: newStatus }
    if (newStatus === 'delivered') updates.delivered_at = new Date().toISOString()

    const { error } = await supabase.from('orders').update(updates).eq('id', orderId)
    if (error) toast.error('خطأ: ' + error.message)
    else toast.success('تم تحديث الحالة ✅')
    fetchOrders()
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
    }
  }

  const saveNotes = async () => {
    if (!selectedOrder) return
    const { error } = await supabase.from('orders').update({ admin_notes: adminNotes }).eq('id', selectedOrder.id)
    if (error) toast.error('خطأ')
    else toast.success('تم حفظ الملاحظات')
  }

  const openWhatsApp = (order: Order, status: string) => {
    const url = getOrderStatusWhatsAppUrl(order.customer_phone, status, order.customer_name, order.order_number)
    window.open(url, '_blank')
  }

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: 'gold' | 'blue' | 'silver' | 'green' | 'red' }> = {
      new:         { label: 'جديد',          variant: 'blue' },
      contacted:   { label: 'تم التواصل',   variant: 'gold' },
      confirmed:   { label: 'مؤكد',          variant: 'gold' },
      in_progress: { label: 'جاري التنفيذ', variant: 'gold' },
      ready:       { label: 'جاهز للشحن',   variant: 'green' },
      shipped:     { label: 'تم الشحن',      variant: 'green' },
      delivered:   { label: 'تم التوصيل',   variant: 'silver' },
      cancelled:   { label: 'ملغي',          variant: 'red' },
    }
    const m = map[status] || { label: status, variant: 'silver' as const }
    return <Badge variant={m.variant}>{m.label}</Badge>
  }

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-ar font-black text-2xl text-text-cream">إدارة الطلبات</h1>
          <p className="font-ar text-text-muted text-sm mt-1">{orders.length} طلب</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 text-gold-pure border border-gold/30 px-4 py-2 rounded-lg font-ar text-sm hover:bg-gold-pure/10 transition-colors cursor-pointer">
          <RefreshCw size={16} />
          تحديث
        </button>
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-ar font-semibold border transition-all cursor-pointer ${
            filterStatus === 'all' ? 'bg-gold-pure/15 border-gold-pure/60 text-gold-pure' : 'border-white/10 text-text-secondary'
          }`}
        >
          الكل ({orders.length})
        </button>
        {ORDER_STATUSES.map(s => (
          <button key={s.value} onClick={() => setFilterStatus(s.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-ar font-semibold border transition-all cursor-pointer ${
              filterStatus === s.value ? 'bg-gold-pure/15 border-gold-pure/60 text-gold-pure' : 'border-white/10 text-text-secondary'
            }`}
          >
            {s.label_ar} {statusCounts[s.value] ? `(${statusCounts[s.value]})` : ''}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-4 text-text-muted" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث بالاسم أو رقم الطلب..." className="input-luxury font-ar pr-10 w-full" />
      </div>

      {/* Table */}
      <div className="card-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right font-ar text-sm">
            <thead className="bg-white/5 text-text-muted border-b border-white/5">
              <tr>
                <th className="p-4 font-semibold">رقم الطلب</th>
                <th className="p-4 font-semibold">العميل</th>
                <th className="p-4 font-semibold">المدينة</th>
                <th className="p-4 font-semibold">المنتج</th>
                <th className="p-4 font-semibold">الحالة</th>
                <th className="p-4 font-semibold">التاريخ</th>
                <th className="p-4 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="p-4"><Skeleton className="h-10 w-full" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="p-12 text-center text-text-muted">
                  <ShoppingCart size={32} className="mx-auto mb-2 opacity-30" />
                  لا توجد طلبات
                </td></tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => { setSelectedOrder(order); setAdminNotes(order.admin_notes || '') }}>
                    <td className="p-4 font-display-en text-gold-muted text-xs">{order.order_number}</td>
                    <td className="p-4">
                      <p className="font-bold text-text-cream">{order.customer_name}</p>
                      <p className="text-xs text-text-muted dir-ltr">{order.customer_phone}</p>
                    </td>
                    <td className="p-4 text-text-secondary">{order.customer_city || '—'}</td>
                    <td className="p-4 text-text-secondary text-xs">{order.product_name || '—'}</td>
                    <td className="p-4">{getStatusBadge(order.status)}</td>
                    <td className="p-4 text-text-muted text-xs">{formatDate(order.created_at, 'ar')}</td>
                    <td className="p-4">
                      <button onClick={e => { e.stopPropagation(); openWhatsApp(order, order.status) }}
                        className="p-2 rounded-lg text-whatsapp-light hover:bg-whatsapp/10 transition-colors cursor-pointer" title="واتساب">
                        <MessageCircle size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`طلب ${selectedOrder?.order_number || ''}`} size="lg">
        {selectedOrder && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-surface/60 rounded-lg p-4">
                <p className="text-xs text-text-muted font-ar mb-1">العميل</p>
                <p className="font-ar font-bold text-text-cream">{selectedOrder.customer_name}</p>
              </div>
              <div className="bg-bg-surface/60 rounded-lg p-4">
                <p className="text-xs text-text-muted font-ar mb-1">التليفون</p>
                <p className="font-body-en text-text-cream" dir="ltr">{selectedOrder.customer_phone}</p>
              </div>
              <div className="bg-bg-surface/60 rounded-lg p-4">
                <p className="text-xs text-text-muted font-ar mb-1">المدينة</p>
                <p className="font-ar text-text-cream">{selectedOrder.customer_city || '—'}</p>
              </div>
              <div className="bg-bg-surface/60 rounded-lg p-4">
                <p className="text-xs text-text-muted font-ar mb-1">المصدر</p>
                <p className="font-ar text-text-cream">{selectedOrder.source}</p>
              </div>
            </div>

            {/* Product */}
            {selectedOrder.product_name && (
              <div className="bg-bg-surface/60 rounded-lg p-4">
                <p className="text-xs text-text-muted font-ar mb-1">المنتج</p>
                <p className="font-ar font-bold text-gold-pure">{selectedOrder.product_name}</p>
                {selectedOrder.custom_notes && (
                  <p className="font-ar text-text-secondary text-sm mt-2">{selectedOrder.custom_notes}</p>
                )}
              </div>
            )}

            {/* Status Update */}
            <div>
              <p className="font-ar font-bold text-text-cream text-sm mb-3">تحديث الحالة</p>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map(s => (
                  <button key={s.value}
                    onClick={() => updateStatus(selectedOrder.id, s.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-ar font-semibold border transition-all cursor-pointer ${
                      selectedOrder.status === s.value
                        ? 'bg-gold-pure/20 border-gold-pure/60 text-gold-pure'
                        : 'border-white/10 text-text-secondary hover:border-gold/30 hover:text-text-cream'
                    }`}
                  >
                    {s.label_ar}
                  </button>
                ))}
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <Textarea label="ملاحظات الإدارة" value={adminNotes} onChange={e => setAdminNotes(e.target.value)} rows={3} placeholder="ملاحظات داخلية..." />
              <button onClick={saveNotes} className="mt-2 bg-gold-pure/15 border border-gold/30 text-gold-pure px-4 py-2 rounded-lg font-ar text-sm hover:bg-gold-pure/25 transition-colors cursor-pointer">
                حفظ الملاحظات
              </button>
            </div>

            {/* WhatsApp Actions */}
            <div>
              <p className="font-ar font-bold text-text-cream text-sm mb-3">إرسال رسالة واتساب</p>
              <div className="flex flex-wrap gap-2">
                {['confirmed', 'in_progress', 'ready', 'shipped', 'delivered'].map(status => (
                  <button key={status}
                    onClick={() => openWhatsApp(selectedOrder, status)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-ar bg-whatsapp/10 border border-whatsapp/20 text-whatsapp-light hover:bg-whatsapp/20 transition-colors cursor-pointer"
                  >
                    <MessageCircle size={12} />
                    {ORDER_STATUSES.find(s => s.value === status)?.label_ar}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
