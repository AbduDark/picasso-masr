'use client'

import { type HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  children,
  glow = false,
  hover = true,
  padding = 'md',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'card-luxury',
        paddingClasses[padding],
        glow && 'shadow-gold-sm',
        hover && 'cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Subcomponents ────────────────────────────────────
Card.Header = function CardHeader({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('mb-4 pb-4 border-b border-white/5', className)} {...props}>
      {children}
    </div>
  )
}

Card.Body = function CardBody({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('flex-1', className)} {...props}>
      {children}
    </div>
  )
}

Card.Footer = function CardFooter({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('mt-4 pt-4 border-t border-white/5', className)} {...props}>
      {children}
    </div>
  )
}
