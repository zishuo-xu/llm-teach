import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { EPISODES, SEASON_COLORS } from '../episodes'

/** 桌面端：按季分组的期数胶囊 */
function EpisodePills() {
  const { pathname } = useLocation()
  const seasons = [...new Set(EPISODES.map((e) => e.season))]

  return (
    <div className="hidden lg:flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/60 px-1.5 py-1">
      {seasons.map((season, si) => (
        <div key={season} className="flex items-center gap-1">
          {si > 0 && <span className="w-px h-4 bg-slate-700/80 mx-1.5" />}
          <span
            className="w-1.5 h-1.5 rounded-full ml-1"
            style={{ backgroundColor: SEASON_COLORS[season].dot }}
            title={SEASON_COLORS[season].label}
          />
          {EPISODES.filter((e) => e.season === season).map((e) => {
            const active = pathname.startsWith(e.path)
            return (
              <Link
                key={e.path}
                to={e.path}
                className={`px-2 py-1 rounded-full font-mono text-xs transition-all ${
                  active
                    ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                {e.navLabel}
              </Link>
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
  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-night/70 border-b border-slate-800/60">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-mono font-semibold text-slate-100 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.9)]" />
          llm-teach
        </Link>

        {sections.length > 0 && (
          <div className="hidden md:flex items-center gap-5 text-sm text-slate-400">
            {sections.map((s) => (
              <a key={s.href} href={s.href} className="hover:text-cyan-300 transition-colors">
                {s.label}
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 shrink-0">
          <EpisodePills />
          <MobileMenu />
        </div>
      </div>
    </nav>
  )
}
