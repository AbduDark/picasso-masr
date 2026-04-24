'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 120)

    const timer = setTimeout(() => {
      setVisible(false)
      document.body.style.overflow = ''
    }, 2000)

    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="loading-screen noise-overlay z-[9999]"
          aria-label="جاري التحميل"
          aria-live="polite"
        >
          {/* Background orbs */}
          <div className="orb w-64 h-64 bg-gold-pure" style={{ top: '30%', left: '30%', animationDelay: '0s' }} />
          <div className="orb w-48 h-48 bg-gold-dark" style={{ bottom: '30%', right: '30%', animationDelay: '2s' }} />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative z-10 text-center"
          >
            {/* Emblem */}
            <div className="relative inline-block mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 -m-4"
              >
                <svg viewBox="0 0 100 100" className="w-24 h-24 opacity-20">
                  <circle
                    cx="50" cy="50" r="45"
                    stroke="url(#goldGrad)" strokeWidth="0.5"
                    fill="none" strokeDasharray="4 4"
                  />
                  <defs>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C9A84C" />
                      <stop offset="100%" stopColor="#E8C97A" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>

              <div className="w-16 h-16 rounded-full bg-bg-surface border border-gold/40 flex items-center justify-center relative">
                <span className="text-gold-pure font-display-en text-2xl font-black">P</span>
              </div>
            </div>

            {/* Brand name */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-ar font-black text-2xl text-gold-shimmer text-gold-shimmer mb-1"
            >
              بيكاسو مصر
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="font-display-en text-[0.6rem] tracking-[0.4em] text-gold-muted uppercase"
            >
              PICASSO MASR
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="loading-bar mt-8"
            >
              <motion.div
                className="h-full bg-gradient-gold rounded-full"
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
