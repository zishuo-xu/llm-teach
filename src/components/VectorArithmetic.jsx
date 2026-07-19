import { useState } from 'react'
import { motion } from 'framer-motion'
import { ARITHMETIC, arithmeticResult, dist } from '../data/embedding'
import { usePlayback } from '../hooks/usePlayback'
import PlaybackControls from './PlaybackControls'

const COLORS = { a: '#22d3ee', b: '#f87171', c: '#4ade80', answer: '#facc15' }

/** 向量算术动画：a − b + c 的落点正好在答案词附近 */
export default function VectorArithmetic() {
  const [exIdx, setExIdx] = useState(0)
  const ex = ARITHMETIC[exIdx]
  const { step, playing, speed, toggle, next, reset, setSpeed } = usePlayback(4, { interval: 1400 })

  const switchEx = (i) => {
    setExIdx(i)
    reset()
  }

  const sy = (y) => 10 - y
  const p1 = { x: ex.a.x - ex.b.x, y: ex.a.y - ex.b.y } // 中间点：a − b
  const r = arithmeticResult(ex) // 落点：a − b + c
  const allWords = [ex.a, ex.b, ex.c, ex.answer, ...ex.others]

  const wordColor = (w) => {
    if (w.word === ex.a.word) return COLORS.a
    if (w.word === ex.b.word) return COLORS.b
    if (w.word === ex.c.word) return COLORS.c
    if (w.word === ex.answer.word) return COLORS.answer
    return '#475569'
  }

  return (
    <div>
      {/* 案例切换 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ARITHMETIC.map((e, i) => (
          <button
            key={e.label}
            onClick={() => switchEx(i)}
            className={`px-3 py-1.5 rounded-full text-sm font-mono transition-colors border ${
              i === exIdx
                ? 'bg-indigo-500/20 border-indigo-400/60 text-indigo-200'
                : 'border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div className="rounded-xl border border-slate-700/80 bg-night-soft p-2">
          <svg viewBox="0 0 10 10" className="w-full aspect-square max-h-96">
            <defs>
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="none" stroke="#94a3b8" strokeWidth="1" />
              </marker>
            </defs>

            {/* 词点 */}
            {allWords.map((w) => {
              const isAnswer = w.word === ex.answer.word
              const revealed = !isAnswer || step >= 4
              const color = revealed ? wordColor(w) : '#334155'
              const isOperand = [ex.a.word, ex.b.word, ex.c.word].includes(w.word)
              return (
                <g key={w.word} opacity={revealed ? 1 : 0.5}>
                  <circle
                    cx={w.x}
                    cy={sy(w.y)}
                    r={isAnswer && step >= 4 ? 0.22 : 0.13}
                    fill={color}
                    opacity={0.3}
                  />
                  <circle cx={w.x} cy={sy(w.y)} r={0.06} fill={color} />
                  <text
                    x={w.x}
                    y={sy(w.y) - 0.18}
                    textAnchor="middle"
                    fontSize="0.32"
                    fill={color}
                    fontWeight={isOperand || (isAnswer && step >= 4) ? 700 : 400}
                  >
                    {isAnswer && step < 4 ? '？' : w.word}
                  </text>
                </g>
              )
            })}

            {/* 起点高亮 */}
            {step >= 1 && (
              <motion.circle
                cx={ex.a.x}
                cy={sy(ex.a.y)}
                r={0.3}
                fill="none"
                stroke={COLORS.a}
                strokeWidth={0.05}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ transformOrigin: `${ex.a.x}px ${sy(ex.a.y)}px` }}
              />
            )}

            {/* 减去 b 的箭头（虚线） */}
            {step >= 2 && (
              <motion.line
                x1={ex.a.x}
                y1={sy(ex.a.y)}
                x2={p1.x}
                y2={sy(p1.y)}
                stroke={COLORS.b}
                strokeWidth={0.07}
                strokeDasharray="0.25 0.12"
                markerEnd="url(#arrow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }}
              />
            )}

            {/* 加上 c 的箭头（实线） */}
            {step >= 3 && (
              <motion.line
                x1={p1.x}
                y1={sy(p1.y)}
                x2={r.x}
                y2={sy(r.y)}
                stroke={COLORS.c}
                strokeWidth={0.07}
                markerEnd="url(#arrow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }}
              />
            )}

            {/* 落点 */}
            {step >= 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <circle cx={r.x} cy={sy(r.y)} r={0.14} fill="#facc15" />
                <text x={r.x} y={sy(r.y) + 0.45} textAnchor="middle" fontSize="0.26" fill="#facc15">
                  落点
                </text>
              </motion.g>
            )}

            {/* 落点 → 答案的连线 */}
            {step >= 4 && (
              <motion.line
                x1={r.x}
                y1={sy(r.y)}
                x2={ex.answer.x}
                y2={sy(ex.answer.y)}
                stroke={COLORS.answer}
                strokeWidth={0.05}
                strokeDasharray="0.15 0.1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
              />
            )}
          </svg>
        </div>

        {/* 解说栏 */}
        <div className="md:w-56 space-y-3">
          <p className="font-mono text-sm text-slate-300">{ex.label}</p>
          <div className="space-y-2 text-sm">
            <motion.p animate={{ opacity: step >= 1 ? 1 : 0.3 }} className="text-slate-400">
              1️⃣ 从「<b style={{ color: COLORS.a }}>{ex.a.word}</b>」出发
            </motion.p>
            <motion.p animate={{ opacity: step >= 2 ? 1 : 0.3 }} className="text-slate-400">
              2️⃣ 减掉「<b style={{ color: COLORS.b }}>{ex.b.word}</b>」的向量
            </motion.p>
            <motion.p animate={{ opacity: step >= 3 ? 1 : 0.3 }} className="text-slate-400">
              3️⃣ 加上「<b style={{ color: COLORS.c }}>{ex.c.word}</b>」的向量
            </motion.p>
            <motion.p animate={{ opacity: step >= 4 ? 1 : 0.3 }} className="text-slate-400">
              4️⃣ 落点最近的词是「<b style={{ color: COLORS.answer }}>{ex.answer.word}</b>」
              （距离 {dist(r, ex.answer).toFixed(2)}）
            </motion.p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <PlaybackControls
          playing={playing}
          speed={speed}
          onToggle={toggle}
          onNext={next}
          onReset={reset}
          onSpeed={setSpeed}
        />
      </div>
    </div>
  )
}
