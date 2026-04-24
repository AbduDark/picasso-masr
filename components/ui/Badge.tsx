import { type HTMLAttributes } from 'react'
import { clsx } from 'clsx'

type BadgeVariant = 'gold' | 'crimson' | 'silver' | 'green' | 'blue' | 'purple' | 'red'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
}

const variantMap: Record<BadgeVariant, string> = {
  gold:    'badge-gold',
  crimson: 'badge-crimson',
  silver:  'badge-silver',
  green:   'badge-green',
  blue:    'bg-blue-500/10 border border-blue-500/30 text-blue-400',
  purple:  'bg-purple-500/10 border border-purple-500/30 text-purple-400',
  red:     'bg-red-500/10 border border-red-500/30 text-red-400',
}

export default function Badge({
  children,
  variant = 'gold',
  dot = false,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx('badge font-ar', variantMap[variant], className)}
      {...props}
    >
      {dot && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full bg-current"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  )
}
