import { useEffect, useState } from 'react'
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

/** 桌面端：按季分组的期数胶囊（带悬浮气泡 + 滑动高亮） */
function EpisodePills() {
  const { pathname } = useLocation()
  const seasons = [...new Set(EPISODES.map((e) => e.season))]

  return (
    <div className="hidden lg:flex items-center gap-0.5 rounded-full border border-slate-700/60 bg-slate-900/70 px-2 py-1 shadow-inner shadow-black/30">
      {seasons.map((season, si) => (
        <div key={season} className="flex items-center gap-0.5">
          {si > 0 && <span className="w-px h-4 bg-slate-700/60 mx-2" />}
          <span
            className="font-mono text-[10px] font-semibold mr-0.5 tracking-wider"
            style={{ color: SEASON_COLORS[season].dot }}
          >
            S{season}
          </span>
          {EPISODES.filter((e) => e.season === season).map((e) => {
            const active = pathname.startsWith(e.path)
            return (
              <span key={e.path} className="relative group">
                <Link
                  to={e.path}
                  className={`relative block px-2.5 py-1 rounded-full font-mono text-xs transition-colors ${
                    active ? 'text-white' : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-[0_0_16px_rgba(99,102,241,0.6)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{e.navLabel}</span>
                </Link>
                {/* 悬浮气泡 */}
                <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2.5 z-50 whitespace-nowrap rounded-xl border border-slate-700/80 bg-night-card/95 backdrop-blur px-3 py-2 text-xs opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-2xl">
                  <span className="font-mono text-[10px] mr-1.5" style={{ color: SEASON_COLORS[season].dot }}>
                    S{season} · {e.navLabel}
                  </span>
                  <span className="text-slate-100">{e.navTitle}</span>
                </span>
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/** 移动端：汉堡菜单 */
function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const seasons = [...new Set(EPISODES.map((e) => e.season))]

  return (
    <div className="lg:hidden relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="菜单"
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
      >
        {open ? '✕' : '☰'}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="absolute right-0 top-12 w-64 rounded-2xl border border-slate-700 bg-night-card/95 backdrop-blur-md p-3 shadow-2xl"
          >
            {seasons.map((season) => (
              <div key={season} className="mb-2 last:mb-0">
                <p className="flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SEASON_COLORS[season].dot }} />
                  {SEASON_COLORS[season].label}
                </p>
                {EPISODES.filter((e) => e.season === season).map((e) => (
                  <Link
                    key={e.path}
                    to={e.path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors ${
                      pathname.startsWith(e.path)
                        ? 'bg-indigo-500/20 text-indigo-200'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-mono text-xs text-slate-500">{e.navLabel}</span>
                    {e.navTitle}
                  </Link>
                ))}
              </div>
            ))}
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
  const { pathname } = useLocation()
  const ids = sections.map((s) => s.href.slice(1))
  const activeId = useScrollSpy(ids)
  const [scrolled, setScrolled] = useState(false)

  // 阅读进度条
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const currentEp = EPISODES.find((e) => pathname.startsWith(e.path))

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-night/75 border-b transition-shadow duration-300 ${
        scrolled ? 'border-slate-700/60 shadow-[0_8px_32px_rgba(2,6,23,0.7)]' : 'border-slate-800/50'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* 左：logo + 当前期面包屑 */}
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          <Link to="/" className="flex items-center gap-2 font-mono font-semibold text-slate-100 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.9)]" />
            llm-teach
          </Link>
          <AnimatePresence>
            {currentEp && (
              <motion.span
                key={currentEp.path}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="hidden sm:flex items-center gap-2 text-xs text-slate-500 truncate"
              >
                <span className="text-slate-700">/</span>
                <span className="font-mono" style={{ color: SEASON_COLORS[currentEp.season].dot }}>
                  {currentEp.navLabel}
                </span>
                <span className="truncate">{currentEp.navTitle}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

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

        <div className="flex items-center gap-3 shrink-0">
          <EpisodePills />
          <MobileMenu />
        </div>
      </div>

      {/* 阅读进度条 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-indigo-500 via-cyan-400 to-teal-300"
        style={{ scaleX: progress }}
      />
    </nav>
  )
}
