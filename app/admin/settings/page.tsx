'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Settings, Save, RefreshCw } from 'lucide-react'
import { Input, Textarea } from '@/components/ui/Input'
import GoldDivider from '@/components/ui/GoldDivider'
import toast from 'react-hot-toast'

interface SettingsData {
  whatsapp_number: string
  instagram_url: string
  facebook_url: string
  tiktok_url: string
  hero_title_ar: string
  hero_subtitle_ar: string
  hero_title_en: string
  hero_subtitle_en: string
}

const DEFAULT_SETTINGS: SettingsData = {
  whatsapp_number: '',
  instagram_url: '',
  facebook_url: '',
  tiktok_url: '',
  hero_title_ar: '',
  hero_subtitle_ar: '',
  hero_title_en: '',
  hero_subtitle_en: '',
}

export default function AdminSettingsPage() {
  const supabase = createClient()
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchSettings = async () => {
    setLoading(true)
    const { data } = await supabase.from('site_settings').select('key, value')
    if (data) {
      const mapped: Record<string, string> = {}
      data.forEach(row => {
        const val = row.value
        mapped[row.key] = typeof val === 'string' ? val : JSON.stringify(val).replace(/^"|"$/g, '')
      })
      setSettings(prev => ({ ...prev, ...mapped }))
    }
    setLoading(false)
  }

  useEffect(() => { fetchSettings() }, [])

  const handleSave = async () => {
    setSaving(true)
    const entries = Object.entries(settings)
    let hasError = false

    for (const [key, value] of entries) {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() })

      if (error) { hasError = true; console.error(key, error) }
    }

    setSaving(false)
    if (hasError) toast.error('حصل خطأ في بعض الإعدادات')
    else toast.success('تم حفظ الإعدادات بنجاح ✅')
  }

  const update = (key: keyof SettingsData, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-ar font-black text-2xl text-text-cream">الإعدادات</h1>
        <div className="card-luxury p-8 animate-pulse space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-ar font-black text-2xl text-text-cream flex items-center gap-3">
            <Settings size={24} className="text-gold-pure" />
            الإعدادات
          </h1>
          <p className="font-ar text-text-muted text-sm mt-1">إعدادات الموقع العامة والمحتوى</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gold-pure text-bg-void px-6 py-2.5 rounded-xl font-ar font-bold text-sm hover:bg-gold-light transition-colors cursor-pointer disabled:opacity-50">
          <Save size={16} />
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      {/* Contact & Social */}
      <div className="card-luxury p-6 space-y-5">
        <h2 className="font-ar font-bold text-lg text-text-cream">بيانات التواصل</h2>
        <GoldDivider variant="line" className="my-0" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="رقم الواتساب" value={settings.whatsapp_number} onChange={e => update('whatsapp_number', e.target.value)} dir="ltr" placeholder="201060339428" />
          <Input label="رابط إنستاغرام" value={settings.instagram_url} onChange={e => update('instagram_url', e.target.value)} dir="ltr" placeholder="https://instagram.com/picassomasr" />
          <Input label="رابط فيسبوك" value={settings.facebook_url} onChange={e => update('facebook_url', e.target.value)} dir="ltr" placeholder="https://facebook.com/picassomasr" />
          <Input label="رابط تيك توك" value={settings.tiktok_url} onChange={e => update('tiktok_url', e.target.value)} dir="ltr" placeholder="https://tiktok.com/@picassomasr" />
        </div>
      </div>

      {/* Hero Content */}
      <div className="card-luxury p-6 space-y-5">
        <h2 className="font-ar font-bold text-lg text-text-cream">محتوى القسم الرئيسي (Hero)</h2>
        <GoldDivider variant="line" className="my-0" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="العنوان الرئيسي (عربي)" value={settings.hero_title_ar} onChange={e => update('hero_title_ar', e.target.value)} />
          <Input label="العنوان الرئيسي (إنجليزي)" value={settings.hero_title_en} onChange={e => update('hero_title_en', e.target.value)} dir="ltr" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Textarea label="الوصف الفرعي (عربي)" value={settings.hero_subtitle_ar} onChange={e => update('hero_subtitle_ar', e.target.value)} rows={3} />
          <Textarea label="الوصف الفرعي (إنجليزي)" value={settings.hero_subtitle_en} onChange={e => update('hero_subtitle_en', e.target.value)} dir="ltr" rows={3} />
        </div>
      </div>

      {/* Info */}
      <div className="card-luxury p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
            <RefreshCw size={14} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-ar font-bold text-text-cream text-sm">ملاحظة</h3>
            <p className="font-ar text-text-secondary text-sm leading-relaxed mt-1">
              بعض التغييرات (مثل محتوى Hero) تحتاج إعادة تحميل الصفحة لتظهر التحديثات. الإعدادات يتم حفظها في Supabase مباشرة.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
