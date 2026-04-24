import { clsx } from 'clsx'

interface GoldDividerProps {
  className?: string
  variant?: 'line' | 'ornate' | 'dots'
  label?: string
}

export default function GoldDivider({ className, variant = 'line', label }: GoldDividerProps) {
  if (variant === 'ornate' || label) {
    return (
      <div className={clsx('flex items-center gap-4 my-8', className)}>
        <div className="flex-1 gold-line" />
        <div className="flex items-center gap-2 text-gold-pure">
          <span className="text-lg">✦</span>
          {label && (
            <span className="text-sm font-display-en tracking-widest uppercase text-gold-muted">
              {label}
            </span>
          )}
          <span className="text-lg">✦</span>
        </div>
        <div className="flex-1 gold-line" />
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={clsx('flex items-center justify-center gap-2 my-8', className)}>
        <div className="w-12 gold-line" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold-muted" />
        <div className="w-2 h-2 rounded-full bg-gold-pure" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold-muted" />
        <div className="w-12 gold-line" />
      </div>
    )
  }

  return <div className={clsx('gold-line my-8', className)} />
}
