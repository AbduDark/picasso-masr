'use client'

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { clsx } from 'clsx'

// ─── Input ────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-text-secondary font-ar">
          {label}
          {props.required && <span className="text-gold-pure mr-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={clsx(
          'input-luxury font-ar',
          error && 'border-red-500/50 focus:border-red-500/70 focus:shadow-none',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400 font-ar">{error}</p>}
      {hint && !error && <p className="text-xs text-text-muted font-ar">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'

// ─── Textarea ─────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  hint,
  className,
  id,
  rows = 4,
  ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-text-secondary font-ar">
          {label}
          {props.required && <span className="text-gold-pure mr-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={clsx(
          'input-luxury font-ar resize-none',
          error && 'border-red-500/50',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400 font-ar">{error}</p>}
      {hint && !error && <p className="text-xs text-text-muted font-ar">{hint}</p>}
    </div>
  )
})

Textarea.displayName = 'Textarea'

// ─── Select ───────────────────────────────────────────
interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-text-secondary font-ar">
          {label}
          {props.required && <span className="text-gold-pure mr-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={clsx(
          'input-luxury font-ar appearance-none',
          error && 'border-red-500/50',
          className,
        )}
        {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-bg-card">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 font-ar">{error}</p>}
    </div>
  )
})

Select.displayName = 'Select'

export default Input
