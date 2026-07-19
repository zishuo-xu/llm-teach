import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { EPISODES, SEASON_COLORS } from '../episodes'

/** 滚动监听：当前可视的章节 id */
function useScrollSpy(ids) {
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    if (ids.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActiveId(en.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])

  return activeId
}

/** 选集下拉：桌面/移动通用，新用户也能看懂 */
function EpisodeMenu() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const ref = useRef(null)
  const seasons = [...new Set(EPISODES.map((e) => e.season))]
  const currentEp = EPISODES.find((e) => pathname.startsWith(e.path))

  // 点击外部关闭
  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
          open
            ? 'border-indigo-400/60 bg-indigo-500/15 text-indigo-200'
            : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:text-slate-100'
        }`}
      >
        <span className="font-mono text-xs text-slate-500">选集</span>
        {currentEp && (
          <>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="hidden sm:inline font-medium">
              <span className="font-mono mr-1.5" style={{ color: SEASON_COLORS[currentEp.season].dot }}>
                {currentEp.navLabel}
              </span>
              {currentEp.navTitle}
            </span>
          </>
        )}
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-xs text-slate-500">
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-13 w-72 rounded-2xl border border-slate-700 bg-night-card/95 backdrop-blur-xl p-3 shadow-2xl"
          >
            {seasons.map((season) => (
              <div key={season} className="mb-2.5 last:mb-0">
                <p className="flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] tracking-wider text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SEASON_COLORS[season].dot }} />
                  {SEASON_COLORS[season].label}
                </p>
                {EPISODES.filter((e) => e.season === season).map((e) => {
                  const active = pathname.startsWith(e.path)
                  return (
                    <Link
                      key={e.path}
                      to={e.path}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm transition-colors ${
                        active
                          ? 'bg-gradient-to-r from-indigo-500/25 to-cyan-500/15 text-slate-100 border border-indigo-400/30'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100 border border-transparent'
                      }`}
                    >
                      <span
                        className="font-mono text-xs w-6 shrink-0"
                        style={{ color: active ? SEASON_COLORS[season].dot : '#64748b' }}
                      >
                        {e.navLabel}
                      </span>
                      {e.navTitle}
                      {active && <span className="ml-auto text-[10px] text-cyan-300">● 在读</span>}
                    </Link>
                  )
                })}
              </div>
            ))}
            <div className="mt-2 pt-2 border-t border-slate-800">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-800/80 hover:text-slate-100 transition-colors"
              >
                <span className="w-6 shrink-0 text-center">⌂</span>
                课程目录首页
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * @param {Array<{href,label}>} sections 当前页的章节锚点（可选）
 */
export default function Navbar({ sections = [] }) {
  const ids = sections.map((s) => s.href.slice(1))
  const activeId = useScrollSpy(ids)
  const [scrolled, setScrolled] = useState(false)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-night/75 border-b transition-shadow duration-300 ${
        scrolled ? 'border-slate-700/60 shadow-[0_8px_32px_rgba(2,6,23,0.7)]' : 'border-slate-800/50'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-mono font-semibold text-slate-100 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.9)]" />
          llm-teach
        </Link>

        {/* 中：章节锚点（滚动监听 + 滑动高亮） */}
        {sections.length > 0 && (
          <div className="hidden xl:flex items-center gap-0.5 text-sm rounded-full border border-slate-800/80 bg-slate-900/40 px-1.5 py-1">
            {sections.map((s) => {
              const active = activeId === s.href.slice(1)
              return (
                <a
                  key={s.href}
                  href={s.href}
                  className={`relative px-3 py-1 rounded-full transition-colors ${
                    active ? 'text-cyan-200' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="section-pill"
                      className="absolute inset-0 rounded-full bg-cyan-400/10 border border-cyan-400/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{s.label}</span>
                </a>
              )
            })}
          </div>
        )}

        <EpisodeMenu />
      </div>

      {/* 阅读进度条 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-indigo-500 via-cyan-400 to-teal-300"
        style={{ scaleX: progress }}
      />
    </nav>
  )
}
