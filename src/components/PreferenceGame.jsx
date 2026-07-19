import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PREFERENCE_ROUNDS } from '../data/alignment'

/** 偏好标注小游戏：三轮"哪个回答更好"，让玩家生产人类偏好数据 */
export default function PreferenceGame() {
  const [round, setRound] = useState(0)
  const [picked, setPicked] = useState(null) // 'a' | 'b'
  const [score, setScore] = useState(0)

  const done = round >= PREFERENCE_ROUNDS.length
  const current = done ? null : PREFERENCE_ROUNDS[round]

  const pick = (side) => {
    if (picked) return
    setPicked(side)
    if (side === current.better) setScore((s) => s + 1)
  }

  const nextRound = () => {
    setRound((r) => r + 1)
    setPicked(null)
  }

  const restart = () => {
    setRound(0)
    setPicked(null)
    setScore(0)
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <p className="text-4xl mb-3">🏷️</p>
        <p className="text-xl font-bold text-slate-100">
          你刚刚生产了 {PREFERENCE_ROUNDS.length} 条人类偏好数据（命中 {score} 条主流选择）
        </p>
        <p className="mt-3 text-slate-400 max-w-lg mx-auto leading-7">
          真实的 RLHF 就是把这件事放大：成千上万的标注员，每天做几十万次这样的二选一。
          这些「人类觉得哪个好」的数据，就是奖励模型的教材。
        </p>
        <button
          onClick={restart}
          className="mt-6 px-6 py-2.5 rounded-full border border-indigo-400/50 text-indigo-300 hover:bg-indigo-500/10 transition-colors"
        >
          ↺ 再玩一次
        </button>
      </motion.div>
    )
  }

  const cardCls = (side) => {
    if (!picked)
      return 'border-slate-700 bg-night-soft hover:border-indigo-400/60 cursor-pointer'
    if (side === current.better) return 'border-emerald-400/70 bg-emerald-500/10'
    return 'border-red-400/50 bg-red-500/5 opacity-75'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 font-mono text-xs text-slate-500">
        <span>
          第 {round + 1} / {PREFERENCE_ROUNDS.length} 题 · 你是标注员：哪个回答更好？
        </span>
        <span>命中 {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={round}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
        >
          <p className="font-mono text-sm text-indigo-300 mb-4">Q：{current.q}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {['a', 'b'].map((side) => (
              <button
                key={side}
                onClick={() => pick(side)}
                disabled={!!picked}
                className={`rounded-xl border p-4 text-left transition-all ${cardCls(side)}`}
              >
                <p className="font-mono text-[10px] text-slate-500 mb-2">
                  回答 {side.toUpperCase()}
                  {picked && side === current.better && ' · ✅ 主流选择'}
                  {picked && side !== current.better && ' · ❌'}
                </p>
                <p className="text-sm text-slate-200 leading-6">{current[side]}</p>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {picked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden"
              >
                <div className="mt-4 rounded-lg border border-slate-700/80 bg-night-soft p-4">
                  <p className="text-sm text-slate-400 leading-6">💡 {current.lesson}</p>
                  <button
                    onClick={nextRound}
                    className="mt-3 px-4 py-1.5 rounded-lg text-sm bg-indigo-500/20 border border-indigo-400/50 text-indigo-200 hover:bg-indigo-500/30 transition-colors"
                  >
                    {round + 1 < PREFERENCE_ROUNDS.length ? '下一题 →' : '查看结果 →'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
