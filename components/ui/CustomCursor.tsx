'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const posRef = useRef({ x: 0, y: 0 })
  const ringPosRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    // Only activate on desktop
    if (window.innerWidth < 1024) return

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // Clickable hover effect
    const addHoverClass = () => {
      dotRef.current?.classList.add('cursor-hover')
      ringRef.current?.classList.add('cursor-hover')
    }
    const removeHoverClass = () => {
      dotRef.current?.classList.remove('cursor-hover')
      ringRef.current?.classList.remove('cursor-hover')
    }

    const handleHoverTargets = () => {
      const targets = document.querySelectorAll('a, button, [role="button"], input, select, textarea, label')
      targets.forEach(el => {
        el.addEventListener('mouseenter', addHoverClass)
        el.addEventListener('mouseleave', removeHoverClass)
      })
    }
    handleHoverTargets()
    const observer = new MutationObserver(handleHoverTargets)
    observer.observe(document.body, { childList: true, subtree: true })

    // Smooth ring follow with lerp
    const animateRing = () => {
      const LERP = 0.12
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * LERP
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * LERP

      if (dotRef.current) {
        dotRef.current.style.left = `${posRef.current.x}px`
        dotRef.current.style.top = `${posRef.current.y}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPosRef.current.x}px`
        ringRef.current.style.top = `${ringPosRef.current.y}px`
      }
      rafRef.current = requestAnimationFrame(animateRing)
    }
    rafRef.current = requestAnimationFrame(animateRing)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      observer.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [isVisible])

  if (typeof window !== 'undefined' && window.innerWidth < 1024) return null

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot hidden lg:block"
        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s' }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="cursor-ring hidden lg:block"
        style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s' }}
        aria-hidden="true"
      />
    </>
  )
}
