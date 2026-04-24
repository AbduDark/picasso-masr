'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  life: number
  maxLife: number
}

interface GoldParticlesProps {
  count?: number
  interactive?: boolean
}

export default function GoldParticles({ count = 60, interactive = true }: GoldParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -999, y: -999 })
  const animFrameRef = useRef<number>(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize particles
    const initParticle = (): Particle => {
      const maxLife = 120 + Math.random() * 180
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.5,
        radius: 0.8 + Math.random() * 2,
        opacity: 0,
        life: Math.random() * maxLife,
        maxLife,
      }
    }

    particlesRef.current = Array.from({ length: count }, initParticle)
    setReady(true)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
    if (interactive) canvas.addEventListener('mousemove', handleMouseMove)

    const goldColors = ['#C9A84C', '#E8C97A', '#F5E6B8', '#8B6914']

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p, i) => {
        // Fade in / out
        if (p.life < 30) {
          p.opacity = p.life / 30
        } else if (p.life > p.maxLife - 30) {
          p.opacity = (p.maxLife - p.life) / 30
        } else {
          p.opacity = 0.6
        }

        // Mouse interaction
        if (interactive) {
          const dx = mouseRef.current.x - p.x
          const dy = mouseRef.current.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            p.vx -= (dx / dist) * 0.05
            p.vy -= (dy / dist) * 0.05
          }
        }

        // Update position
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99
        p.life++

        // Reset when dead or out of bounds
        if (p.life >= p.maxLife || p.x < 0 || p.x > canvas.width || p.y < 0) {
          particlesRef.current[i] = initParticle()
          return
        }

        // Draw
        const colorIndex = Math.floor((p.radius - 0.8) * 2) % goldColors.length
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = goldColors[colorIndex]
        ctx.globalAlpha = p.opacity * 0.8
        ctx.fill()

        // Tiny glow
        if (p.radius > 1.5) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2)
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5)
          grad.addColorStop(0, 'rgba(201,168,76,0.3)')
          grad.addColorStop(1, 'transparent')
          ctx.fillStyle = grad
          ctx.globalAlpha = p.opacity * 0.4
          ctx.fill()
        }
        ctx.globalAlpha = 1
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (interactive) canvas.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [count, interactive])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: ready ? 1 : 0, transition: 'opacity 1s ease' }}
      aria-hidden="true"
    />
  )
}
