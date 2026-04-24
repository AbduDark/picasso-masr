'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Package, ShoppingCart, MessageSquare, TrendingUp,
  Clock, CheckCircle, Star, BarChart3, ArrowUpRight,
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Skeleton from '@/components/ui/Skeleton'
import Link from 'next/link'

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  newInquiries: number
  totalRevenue: number
  totalProducts: number
  totalTestimonials: number
  recentOrders: any[]
  statusBreakdown: { status: string; count: number }[]
  topProducts: { name: string; count: number }[]
}

export default function AdminDashboard() {
  const supabase = createClient()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const [
          { data: orders, count: orderCount },
          { count: inquiryCount },
          { count: productCount },
          { count: testimonialCount },
        ] = await Promise.all([
          supabase
            .from('orders')
            .select('id, status, total, order_number, customer_name, product_name, created_at', { count: 'exact' })
            .order('created_at', { ascending: false }),
          supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('is_read', false),
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('testimonials').select('id', { count: 'exact', head: true }),
        ])

        const pending = orders?.filter(o => ['new', 'contacted', 'confirmed', 'in_progress'].includes(o.status)) || []
        const revenue = orders?.filter(o => o.status === 'delivered').reduce((acc, o) => acc + (o.total || 0), 0) || 0

        // Status breakdown
        const statusMap: Record<string, number> = {}
        orders?.forEach(o => { statusMap[o.status] = (statusMap[o.status] || 0) + 1 })
        const statusBreakdown = Object.entries(statusMap).map(([status, count]) => ({ status, count }))
          .sort((a, b) => b.count - a.count)

        // Top products
        const productMap: Record<string, number> = {}
        orders?.forEach(o => {
          if (o.product_name) productMap[o.product_name] = (productMap[o.product_name] || 0) + 1
        })
        const topProducts = Object.entries(productMap).map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count).slice(0, 5)

        setStats({
          totalOrders: orderCount || 0,
          pendingOrders: pending.length,
          newInquiries: inquiryCount || 0,
          totalRevenue: revenue,
          totalProducts: productCount || 0,
          totalTestimonials: testimonialCount || 0,
          recentOrders: orders?.slice(0, 5) || [],
          statusBreakdown,
          topProducts,
        })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: 'gold' | 'blue' | 'silver' | 'green' | 'red' }> = {
      new:         { label: 'جديد',          variant: 'blue' },
      contacted:   { label: 'تم التواصل',    variant: 'gold' },
      in_progress: { label: 'جاري التنفيذ',  variant: 'gold' },
      confirmed:   { label: 'مؤكد',          variant: 'gold' },
      ready:       { label: 'جاهز للشحن',    variant: 'green' },
      shipped:     { label: 'تم الشحن',      variant: 'green' },
      delivered:   { label: 'تم التوصيل',    variant: 'silver' },
      cancelled:   { label: 'ملغي',          variant: 'red' },
    }
    const mapped = map[status] || { label: status, variant: 'silver' }
    return <Badge variant={mapped.variant}>{mapped.label}</Badge>
  }

  const statusLabels: Record<string, string> = {
    new: 'جديد', contacted: 'تم التواصل', confirmed: 'مؤكد',
    in_progress: 'جاري التنفيذ', ready: 'جاهز', shipped: 'تم الشحن',
    delivered: 'تم التوصيل', cancelled: 'ملغي',
  }

  const maxStatusCount = Math.max(...(stats?.statusBreakdown.map(s => s.count) || [1]))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-ar font-black text-2xl text-text-cream mb-1">لوحة التحكم</h1>
        <p className="font-ar text-text-muted text-sm">نظرة عامة على نشاط بيكاسو مصر</p>
      </div>

      {/* ── Stat Cards Row 1 ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { title: 'إجمالي الطلبات',    value: stats?.totalOrders,     icon: ShoppingCart, color: 'text-gold-pure',    bg: 'bg-gold-pure/10' },
          { title: 'قيد التنفيذ',        value: stats?.pendingOrders,   icon: Clock,        color: 'text-blue-400',    bg: 'bg-blue-400/10' },
          { title: 'استفسارات جديدة',   value: stats?.newInquiries,    icon: MessageSquare,color: 'text-pink-400',    bg: 'bg-pink-400/10' },
          { title: 'المنتجات',           value: stats?.totalProducts,   icon: Package,      color: 'text-violet-400',  bg: 'bg-violet-400/10' },
          { title: 'الشهادات',           value: stats?.totalTestimonials, icon: Star,        color: 'text-amber-400',   bg: 'bg-amber-400/10' },
          {
            title: 'إجمالي المبيعات',
            value: formatPrice(stats?.totalRevenue || 0, 'ar'),
            icon: TrendingUp,
            color: 'text-green-400',
            bg: 'bg-green-400/10',
          },
        ].map(({ title, value, icon: Icon, color, bg }) => (
          <div key={title} className="card-luxury p-4 flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="font-ar text-text-muted text-xs mb-0.5">{title}</p>
              {loading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <p className="font-display-en font-black text-xl text-text-cream">{value ?? 0}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Orders */}
        <div className="lg:col-span-2 card-luxury overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-ar font-bold text-lg text-text-cream">أحدث الطلبات</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-xs text-gold-pure hover:underline font-ar">
              عرض الكل <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right font-ar text-sm">
              <thead className="bg-white/5 text-text-muted">
                <tr>
                  <th className="p-4 font-semibold">رقم الطلب</th>
                  <th className="p-4 font-semibold">العميل</th>
                  <th className="p-4 font-semibold hidden sm:table-cell">التاريخ</th>
                  <th className="p-4 font-semibold">الحالة</th>
                  <th className="p-4 font-semibold">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="p-4 hidden sm:table-cell"><Skeleton className="h-4 w-20" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                    </tr>
                  ))
                ) : stats?.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-text-muted">لا توجد طلبات بعد</td>
                  </tr>
                ) : (
                  stats?.recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-display-en text-gold-muted text-xs">{order.order_number}</td>
                      <td className="p-4 text-text-cream">{order.customer_name}</td>
                      <td className="p-4 text-text-muted hidden sm:table-cell">{formatDate(order.created_at, 'ar')}</td>
                      <td className="p-4">{getStatusBadge(order.status)}</td>
                      <td className="p-4 font-bold text-gold-pure">{formatPrice(order.total, 'ar')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Status Breakdown Chart */}
          <div className="card-luxury p-5">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={16} className="text-gold-pure" />
              <h2 className="font-ar font-bold text-base text-text-cream">توزيع حالات الطلبات</h2>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-6 w-full" />)}
              </div>
            ) : stats?.statusBreakdown.length === 0 ? (
              <p className="font-ar text-text-muted text-sm text-center py-4">لا توجد بيانات بعد</p>
            ) : (
              <div className="space-y-3">
                {stats?.statusBreakdown.map(({ status, count }) => (
                  <div key={status}>
                    <div className="flex justify-between font-ar text-xs mb-1">
                      <span className="text-text-secondary">{statusLabels[status] ?? status}</span>
                      <span className="text-text-muted">{count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-muted to-gold-pure rounded-full transition-all duration-700"
                        style={{ width: `${(count / maxStatusCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card-luxury p-5">
            <h2 className="font-ar font-bold text-base text-text-cream mb-4">إجراءات سريعة</h2>
            <div className="space-y-2.5">
              {[
                { href: '/admin/products', icon: Package,      color: 'gold',   label: 'إضافة منتج جديد' },
                { href: '/admin/testimonials', icon: Star,     color: 'amber',  label: 'إضافة رأي عميل' },
                { href: '/admin/gallery', icon: MessageSquare, color: 'pink',   label: 'رفع صورة للمعرض' },
                { href: '/admin/orders', icon: CheckCircle,    color: 'blue',   label: 'تحديث حالة الطلبات' },
              ].map(({ href, icon: Icon, color, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:border-gold/20 hover:bg-white/5 transition-all group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${color}-400/10`}>
                    <Icon size={16} className={`text-${color}-400 group-hover:scale-110 transition-transform`} />
                  </div>
                  <span className="font-ar text-sm text-text-secondary group-hover:text-text-cream transition-colors">{label}</span>
                  <ArrowUpRight size={14} className="mr-auto text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Top Products */}
      {!loading && (stats?.topProducts?.length ?? 0) > 0 && (
        <div className="card-luxury p-5">
          <h2 className="font-ar font-bold text-base text-text-cream mb-5">أكثر المنتجات طلباً</h2>
          <div className="space-y-3">
            {stats?.topProducts.map(({ name, count }, i) => (
              <div key={name} className="flex items-center gap-3">
                <span className="font-display-en font-black text-text-muted w-5 text-center">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between font-ar text-sm mb-1">
                    <span className="text-text-cream">{name}</span>
                    <span className="text-gold-pure font-bold">{count} طلب</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-muted/50 to-gold-pure rounded-full"
                      style={{ width: `${(count / (stats.topProducts[0]?.count || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
