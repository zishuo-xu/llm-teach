import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RLHF_STAGES } from '../data/alignment'

/** RLHF 三步流程：点击/依次浏览 SFT → RM → PPO */
export default function RLHFFlowDemo() {
  const [active, setActive] = useState(0)

  return (
    <div>
      {/* 三步条 */}
      <div className="flex flex-col md:flex-row gap-2">
        {RLHF_STAGES.map((s, i) => {
          const isActive = i === active
          return (
            <div key={s.name} className="flex md:flex-col items-center gap-2 flex-1">
              <button
                onClick={() => setActive(i)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  isActive
                    ? 'border-opacity-70 shadow-lg'
                    : 'border-slate-700 bg-night-soft opacity-70 hover:opacity-100'
                }`}
                style={
                  isActive
                    ? {
                        borderColor: `${s.color}aa`,
                        backgroundColor: `${s.color}14`,
                        boxShadow: `0 0 24px ${s.color}30`,
                      }
                    : undefined
                }
              >
                <p className="text-2xl">{s.icon}</p>
                <p className="mt-1.5 text-sm font-bold" style={{ color: isActive ? s.color : '#e2e8f0' }}>
                  {s.name}
                </p>
              </button>
              {i < RLHF_STAGES.length - 1 && (
                <span className={`text-lg shrink-0 md:rotate-0 rotate-90 ${i < active ? 'text-slate-400' : 'text-slate-700'}`}>
                  ➜
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* 详情 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-5 rounded-xl border p-5"
          style={{
            borderColor: `${RLHF_STAGES[active].color}55`,
            backgroundColor: `${RLHF_STAGES[active].color}0a`,
          }}
        >
          <p className="text-sm text-slate-300 leading-7">{RLHF_STAGES[active].summary}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setActive((a) => Math.max(0, a - 1))}
              disabled={active === 0}
              className="px-3 py-1.5 rounded-lg text-sm bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 transition-colors"
            >
              ← 上一步
            </button>
            <button
              onClick={() => setActive((a) => Math.min(RLHF_STAGES.length - 1, a + 1))}
              disabled={active === RLHF_STAGES.length - 1}
              className="px-3 py-1.5 rounded-lg text-sm bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 transition-colors"
            >
              下一步 →
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
