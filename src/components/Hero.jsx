import { useMemo } from 'react'
import { motion } from 'framer-motion'

/** 星光粒子背景 */
function Stars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: `${(i * 37.7) % 100}%`,
        top: `${(i * 53.3) % 100}%`,
        size: 1 + ((i * 7) % 3),
        delay: (i * 0.37) % 3,
      })),
    []
  )
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {stars.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-cyan-200"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, delay: s.delay }}
        />
      ))}
    </div>
  )
}

export default function Hero({ kicker, title, subtitle, ctaLabel = '开始探索 ↓', ctaHref }) {
  return (
    <header className="relative min-h-screen flex items-center justify-center">
      <Stars />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_60%)]" />
      <div className="relative text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-cyan-300/80 tracking-widest text-sm mb-6"
        >
          {kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-5xl md:text-7xl font-black leading-tight bg-gradient-to-r from-indigo-300 via-cyan-300 to-teal-200 bg-clip-text text-transparent"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-slate-400 text-lg max-w-xl mx-auto"
        >
          {subtitle}
        </motion.p>
        {ctaHref && (
          <motion.a
            href={ctaHref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-block mt-12 px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-cyan-500/40 hover:scale-105 transition-all"
          >
            {ctaLabel}
          </motion.a>
        )}
      </div>
      <motion.div
        className="absolute bottom-8 text-slate-600 text-2xl"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        ▼
      </motion.div>
    </header>
  )
}
