'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type { Language } from '@/types'
import ar from '@/messages/ar.json'
import en from '@/messages/en.json'

type Messages = typeof ar

interface LanguageContextValue {
  lang: Language
  dir: 'rtl' | 'ltr'
  t: (key: string) => string
  toggleLanguage: () => void
  isArabic: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === 'object' && key in (current as object)) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path // return key as fallback
    }
  }
  return typeof current === 'string' ? current : path
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('ar')

  const toggleLanguage = useCallback(() => {
    setLang(prev => {
      const next = prev === 'ar' ? 'en' : 'ar'
      const html = document.documentElement
      html.lang = next
      html.dir = next === 'ar' ? 'rtl' : 'ltr'
      html.setAttribute('data-lang', next)
      return next
    })
  }, [])

  const t = useCallback(
    (key: string): string => {
      const messages = lang === 'ar' ? ar : en
      return getNestedValue(messages as Record<string, unknown>, key)
    },
    [lang],
  )

  // Sync html attributes on mount
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('data-lang', lang)
  }, [lang])

  return (
    <LanguageContext.Provider
      value={{
        lang,
        dir: lang === 'ar' ? 'rtl' : 'ltr',
        t,
        toggleLanguage,
        isArabic: lang === 'ar',
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
