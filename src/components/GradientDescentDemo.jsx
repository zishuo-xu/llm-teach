import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { usePlayback } from '../hooks/usePlayback'
import PlaybackControls from './PlaybackControls'

const STEPS = 10
const X0 = 2.5

const LR_OPTIONS = [
  { lr: 0.1, label: 'lr = 0.1', desc: '步子太小：稳，但慢吞吞' },
  { lr: 0.5, label: 'lr = 0.5', desc: '步子合适：几步就到谷底' },
  { lr: 1.05, label: 'lr = 1.05', desc: '步子太大：来回过冲，直接飞出去' },
]

/** 梯度下降动画：在 y = x² 的"损失山谷"里放一个小球 */
export default function GradientDescentDemo() {
  const [lr, setLr] = useState(0.5)
  const { step, playing, speed, toggle, next, reset, setSpeed } = usePlayback(STEPS, {
    interval: 700,
  })

  const changeLr = (v) => {
    setLr(v)
    reset()
  }

  // x_{n+1} = x_n - lr · 2x_n
  const positions = useMemo(() => {
    const arr = [X0]
    for (let i = 1; i <= STEPS; i++) arr.push(arr[i - 1] - lr * 2 * arr[i - 1])
    return arr
  }, [lr])

  const x = positions[step]
  const diverged = Math.abs(x) > 3.2

  // svg：x ∈ [-3.2, 3.2] → [8, 96]；y = x² ∈ [0, 9] → [88, 12]
  const sx = (v) => 8 + ((v + 3.2) / 6.4) * 88
  const sy = (v) => 88 - (Math.min(v, 9.5) / 9.5) * 76

  const curve = Array.from({ length: 80 }, (_, i) => {
    const v = -3.2 + (i / 79) * 6.4
    return `${i === 0 ? 'M' : 'L'} ${sx(v)} ${sy(v * v)}`
  }).join(' ')

  const trail = positions.slice(0, step + 1)

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {LR_OPTIONS.map((o) => (
          <button
            key={o.lr}
            onClick={() => changeLr(o.lr)}
            className={`px-3 py-1.5 rounded-full text-sm font-mono transition-colors border ${
              lr === o.lr
                ? 'bg-indigo-500/20 border-indigo-400/60 text-indigo-200'
                : 'border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            {o.label}
          </button>
        ))}
        <span className="ml-auto font-mono text-xs text-slate-500 self-center">
          {LR_OPTIONS.find((o) => o.lr === lr).desc}
        </span>
      </div>

      <div className="rounded-xl border border-slate-700/80 bg-night-soft p-2">
        <svg viewBox="0 0 100 100" className="w-full aspect-[2/1] max-h-72">
          {/* 谷底 */}
          <circle cx={sx(0)} cy={sy(0)} r="1" fill="#4ade80" />
          <text x={sx(0)} y={sy(0) + 5} textAnchor="middle" fontSize="3" fill="#4ade80">
            损失最小（学好了）
          </text>

          {/* 山谷 */}
          <path d={curve} fill="none" stroke="#818cf8" strokeWidth="0.7" />

          {/* 轨迹线 */}
          {trail.map((v, i) =>
            i === 0 ? null : (
              <motion.line
                key={`${lr}-${i}`}
                x1={sx(trail[i - 1])}
                y1={sy(trail[i - 1] ** 2)}
                x2={sx(v)}
                y2={sy(v * v)}
                stroke="#22d3ee"
                strokeWidth="0.35"
                strokeDasharray="1 0.8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
              />
            )
          )}

          {/* 小球 */}
          <motion.circle
            animate={{ cx: sx(x), cy: sy(x * x) }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            r="1.8"
            fill={diverged ? '#f87171' : '#22d3ee'}
            style={{ filter: 'drop-shadow(0 0 2.5px rgba(34,211,238,0.8))' }}
          />
        </svg>
      </div>

      <motion.p
        key={`${lr}-${step}-${diverged}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-3 text-sm text-slate-400 min-h-6"
      >
        {diverged
          ? '💥 学习率太大，小球在谷壁间来回弹跳、越蹦越高 —— 训练发散了。'
          : Math.abs(x) < 0.05
            ? `✅ 第 ${step} 步到达谷底：参数调整完成，损失最小。`
            : `第 ${step} 步：当前损失 ${(x * x).toFixed(2)}，梯度方向指向更低处，继续走……`}
      </motion.p>

      <div className="flex justify-center mt-4">
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
