import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  animate?: boolean
}

function Skeleton({ className, rounded = 'md', animate = true }: SkeletonProps) {
  const roundedMap = {
    sm:   'rounded-sm',
    md:   'rounded-md',
    lg:   'rounded-xl',
    full: 'rounded-full',
  }

  return (
    <div
      className={clsx(
        'bg-bg-surface relative overflow-hidden',
        roundedMap[rounded],
        animate && 'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/[0.04] after:to-transparent after:-translate-x-full after:animate-[shimmer_1.8s_ease-in-out_infinite]',
        className,
      )}
      aria-hidden="true"
    />
  )
}

// ─── Pre-built Skeleton Patterns ──────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="card-luxury overflow-hidden">
      <Skeleton className="w-full aspect-[4/5]" rounded="sm" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-16" rounded="full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-10 w-full" rounded="lg" />
      </div>
    </div>
  )
}

export function TestimonialSkeleton() {
  return (
    <div className="card-luxury p-6 space-y-4">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-4 h-4" rounded="sm" />
        ))}
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10" rounded="full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="text-center space-y-2">
      <Skeleton className="h-16 w-32 mx-auto" rounded="lg" />
      <Skeleton className="h-4 w-24 mx-auto" />
    </div>
  )
}

export default Skeleton
