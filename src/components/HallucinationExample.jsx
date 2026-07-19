import { motion, AnimatePresence } from 'framer-motion'
import { TRAP_QUESTION, TRAP_ANSWER, TRAP_FACTS } from '../data/hallucination'
import { usePlayback } from '../hooks/usePlayback'

/** 翻车现场：打字机播放模型一本正经地编造，播完弹出纠错标注 */
export default function HallucinationExample() {
  const total = TRAP_ANSWER.length
  const { step, playing, speed, toggle, next, reset, setSpeed } = usePlayback(total, {
    interval: 45,
  })
  const done = step >= total

  return (
    <div className="space-y-5">
      {/* 提问 */}
      <div className="flex justify-end">
        <p className="max-w-md rounded-2xl rounded-br-sm bg-indigo-500/20 border border-indigo-400/40 px-4 py-3 text-sm text-indigo-100">
          {TRAP_QUESTION}
        </p>
      </div>

      {/* 模型回答（打字机） */}
      <div className="flex">
        <div className="max-w-lg rounded-2xl rounded-bl-sm border border-slate-700 bg-night-soft px-4 py-3">
          <p className="font-mono text-[10px] text-slate-500 mb-2">🤖 模型回答</p>
          <p className="text-sm leading-7 text-slate-200 min-h-24">
            {TRAP_ANSWER.slice(0, step)}
            {!done && (
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-cyan-300"
              >
                ▍
              </motion.span>
            )}
          </p>
          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 pt-3 border-t border-red-500/30 space-y-1.5"
              >
                {TRAP_FACTS.map((f, i) => (
                  <motion.p
                    key={f}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.25 }}
                    className="text-xs text-red-400"
                  >
                    ❌ {f}
                  </motion.p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 控制 */}
      <div className="flex justify-center gap-2">
        <button
          onClick={toggle}
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
        >
          {playing ? '⏸ 暂停' : step === 0 ? '▶ 看模型回答' : '▶ 继续'}
        </button>
        <button
          onClick={() => setSpeed(speed === 1 ? 3 : 1)}
          className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800/80 text-slate-400 border border-slate-700 hover:bg-slate-700 transition-colors"
        >
          {speed}x
        </button>
        <button
          onClick={reset}
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
        >
          ↺ 重来
        </button>
      </div>
    </div>
  )
}
