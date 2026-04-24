'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  trigger?: boolean
  className?: string
}

export default function CountUp({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  trigger = true,
  className,
}: CountUpProps) {
  const [count, setCount] = useState(0)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!trigger || hasStarted.current) return
    hasStarted.current = true

    const startTime = performance.now()
    const startValue = 0

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOut(progress)
      const current = Math.round(startValue + (end - startValue) * easedProgress)
      setCount(current)
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [trigger, end, duration])

  return (
    <span className={className}>
      {prefix}{count.toLocaleString('ar-EG')}{suffix}
    </span>
  )
}
