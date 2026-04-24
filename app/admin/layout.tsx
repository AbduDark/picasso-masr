'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, Image as ImageIcon, Settings, LogOut, Menu, X, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/components/providers/LanguageProvider'
import toast from 'react-hot-toast'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isLoginPage = pathname === '/admin/login'
  // Start as checked on login page to avoid hydration mismatch
  const [authChecked, setAuthChecked] = useState(isLoginPage)
  const [authenticated, setAuthenticated] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // onAuthStateChange fires INITIAL_SESSION when the client reads cookies on init
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        if (session) {
          setAuthenticated(true)
          setAuthChecked(true)
        } else if (!isLoginPage) {
          window.location.href = '/admin/login'
        }
      } else if (event === 'SIGNED_IN') {
        setAuthenticated(true)
        setAuthChecked(true)
      } else if (event === 'SIGNED_OUT') {
        window.location.href = '/admin/login'
      }
    })

    return () => subscription.unsubscribe()
  }, [isLoginPage]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('تم تسجيل الخروج')
    window.location.href = '/admin/login'
  }

  const menu = [
    { icon: LayoutDashboard, label: t('admin.dashboard'), href: '/admin' },
    { icon: Package,         label: t('admin.products'),  href: '/admin/products' },
    { icon: ShoppingCart,    label: t('admin.orders'),    href: '/admin/orders' },
    { icon: MessageSquare,   label: t('admin.inquiries'), href: '/admin/inquiries' },
    { icon: Star,            label: 'آراء العملاء',       href: '/admin/testimonials' },
    { icon: ImageIcon,       label: t('admin.gallery'),   href: '/admin/gallery' },
    { icon: Settings,        label: t('admin.settings'),  href: '/admin/settings' },
  ]

  // Login page: render without sidebar (no auth check needed)
  if (isLoginPage) {
    return <>{children}</>
  }

  // Protected pages: show loading spinner until auth is confirmed
  if (!authChecked || !authenticated) {
    return (
      <div className="min-h-screen bg-bg-void flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-pure border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="block" target="_blank">
          <span className="font-ar font-black text-xl text-gold-pure block mb-1">بيكاسو مصر</span>
          <span className="font-display-en text-[0.45rem] tracking-[0.35em] text-gold-muted uppercase">
            PICASSO MASR
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menu.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-ar text-sm transition-all duration-200 ${
                active
                  ? 'bg-gold-pure/10 text-gold-pure border border-gold-pure/20 font-bold'
                  : 'text-text-secondary hover:bg-white/5 hover:text-text-cream border border-transparent'
              }`}
            >
              <item.icon size={18} className={active ? 'text-gold-pure' : 'text-text-muted'} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors font-ar text-sm cursor-pointer"
        >
          <LogOut size={18} />
          {t('admin.logout')}
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-bg-void flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-bg-dark border-b border-gold/10 z-40 flex items-center justify-between px-4">
        <span className="font-ar font-bold text-gold-pure">الإدارة</span>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-text-secondary hover:text-gold-pure cursor-pointer"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 bottom-0 right-0 w-64 bg-bg-dark border-l border-gold/10 flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 left-4 p-2 text-text-muted hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-bg-dark border-l border-gold/10 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
