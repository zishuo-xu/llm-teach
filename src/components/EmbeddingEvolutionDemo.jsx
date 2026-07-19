import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SEMANTIC_WORDS, CLUSTER_COLORS } from '../data/embedding'
import { makeRandomStream } from '../utils/random'
import { usePlayback } from '../hooks/usePlayback'
import PlaybackControls from './PlaybackControls'

const STEPS = 10

/** 回扣第五期：训练把随机初始化的词向量，一步步"推"成按语义聚类 */
export default function EmbeddingEvolutionDemo() {
  const { step, playing, speed, toggle, next, reset, setSpeed } = usePlayback(STEPS, {
    interval: 600,
  })
  const t = step / STEPS
  const eased = 1 - (1 - t) ** 3 // easeOutCubic

  // 每个词的随机起点（固定 seed，重放一致）
  const starts = useMemo(() => {
    const rand = makeRandomStream(2024)
    return SEMANTIC_WORDS.map(() => ({ x: 8 + rand() * 84, y: 8 + rand() * 84 }))
  }, [])

  const sy = (y) => 100 - y

  return (
    <div>
      <p className="font-mono text-xs text-slate-500 mb-3">
        点击播放：{STEPS} 轮训练，看词向量从随机散乱 → 按语义聚类
      </p>

      <div className="rounded-xl border border-slate-700/80 bg-night-soft p-2">
        <svg viewBox="0 0 100 100" className="w-full aspect-square max-h-105">
          {SEMANTIC_WORDS.map((w, i) => {
            const x = starts[i].x + (w.x - starts[i].x) * eased
            const y = starts[i].y + (w.y - starts[i].y) * eased
            const color = CLUSTER_COLORS[w.cluster]
            return (
              <motion.g key={w.word} animate={{ opacity: 0.4 + eased * 0.6 }}>
                <motion.circle
                  animate={{ cx: x, cy: sy(y) }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  r={2}
                  fill={color}
                  opacity={0.25}
                />
                <motion.circle
                  animate={{ cx: x, cy: sy(y) }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  r={1.1}
                  fill={color}
                />
                <motion.text
                  animate={{ x, y: sy(y) - 2.6 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  textAnchor="middle"
                  fontSize="3.2"
                  fill={color}
                >
                  {w.word}
                </motion.text>
              </motion.g>
            )
          })}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {Object.entries(CLUSTER_COLORS).map(([name, color]) => (
          <span key={name} className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            {name}
          </span>
        ))}
        <span className="ml-auto font-mono text-xs text-slate-500">
          训练进度 {Math.round(t * 100)}%
        </span>
      </div>

      <motion.p
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-3 text-sm text-slate-400 min-h-6"
      >
        {step === 0 && '刚初始化时，所有向量都是随机数 —— 语义相近的词天各一方。'}
        {step > 0 && step < STEPS &&
          '每一轮训练都在微调：出现在相似上下文里的词（猫/狗、苹果/香蕉），向量被一点点推近。'}
        {step >= STEPS &&
          '✅ 训练结束：意思近的词聚成了一簇 —— 第五期那张语义地图，就是这么长出来的。'}
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
