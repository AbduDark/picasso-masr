'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setLoading(false)
      toast.error('بيانات الدخول غير صحيحة')
    } else {
      toast.success('تم تسجيل الدخول بنجاح')
      // Hard redirect ensures cookies are sent with the next request
      // so the middleware can validate the session correctly
      window.location.href = '/admin'
    }
  }

  return (
    <div className="min-h-screen bg-bg-void flex items-center justify-center p-4 noise-overlay">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold-pure/10 border border-gold/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(201,168,76,0.15)]">
            <Shield size={28} className="text-gold-pure" />
          </div>
          <h1 className="font-ar font-black text-2xl text-gold-shimmer mb-2">تسجيل دخول الإدارة</h1>
          <p className="font-ar text-text-secondary text-sm">أدخل بيانات الاعتماد للوصول للوحة التحكم</p>
        </div>

        <div className="card-luxury p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              label="البريد الإلكتروني"
              type="email"
              dir="ltr"
              placeholder="admin@picassomasr.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="كلمة المرور"
              type="password"
              dir="ltr"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-whatsapp py-3 rounded-xl font-ar font-bold flex items-center justify-center cursor-pointer mt-2"
              style={{ background: 'var(--gold-pure)', color: '#000' }}
            >
              {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
