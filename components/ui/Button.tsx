'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const sizeClasses: Record<Size, string> = {
  sm:  'px-4 py-2 text-sm gap-1.5',
  md:  'px-6 py-3 text-base gap-2',
  lg:  'px-8 py-4 text-lg gap-2.5',
  xl:  'px-10 py-5 text-xl gap-3',
}

const variantClasses: Record<Variant, string> = {
  primary:   'btn-primary font-ar font-bold',
  secondary: 'btn-secondary font-ar font-semibold',
  ghost:     'bg-transparent text-gold-pure hover:text-gold-light hover:bg-white/5 border border-transparent font-ar font-semibold transition-all duration-300',
  whatsapp:  'btn-whatsapp font-ar font-bold',
  danger:    'bg-red-900/20 border border-red-500/30 text-red-400 hover:bg-red-900/40 hover:border-red-500/60 font-ar font-semibold transition-all duration-300',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'right',
  className,
  disabled,
  ...props
}, ref) => {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={clsx(
        'relative inline-flex items-center justify-center rounded-lg',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-pure/50',
        'select-none transition-all duration-300',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin w-5 h-5"
            fill="none" viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </span>
      )}

      <span className={clsx('inline-flex items-center gap-inherit', loading && 'invisible')}>
        {icon && iconPosition === 'left' && (
          <span className="shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="shrink-0">{icon}</span>
        )}
      </span>
    </button>
  )
})

Button.displayName = 'Button'
export default Button
