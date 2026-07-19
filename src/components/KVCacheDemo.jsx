import { motion } from 'framer-motion'
import { usePlayback } from '../hooks/usePlayback'
import PlaybackControls from './PlaybackControls'
import { DEMO_SEQ, noCacheRows } from '../data/cache'
import { tokenColor } from '../data/tokens'

function Counter({ label, value, tone }) {
  const colors =
    tone === 'red'
      ? 'border-red-500/30 bg-red-500/5 text-red-400'
      : 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400'
  return (
    <div className={`rounded-lg border p-3 ${colors}`}>
      <p className="font-mono text-[10px] text-slate-500">{label}</p>
      <motion.p
        key={value}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        className="font-mono text-3xl font-bold"
      >
        {value}
      </motion.p>
    </div>
  )
}

/** 小尺寸注意力矩阵，mode: 'naive' 全量重算 | 'cached' 只算新行 */
function MiniMatrix({ step, mode }) {
  const n = DEMO_SEQ.length
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}>
      {Array.from({ length: n * n }, (_, idx) => {
        const r = Math.floor(idx / n)
        const c = idx % n
        const valid = c <= r && r <= step
        let cls = 'bg-slate-800/50 opacity-20'
        if (valid) {
          if (mode === 'naive') {
            cls =
              r === step
                ? 'bg-cyan-400/90'
                : 'bg-red-500/60'
          } else {
            // cached：历史行直接读缓存（绿色），只有新行真正计算（青色）
            cls = r === step ? 'bg-cyan-400/90' : 'bg-emerald-500/50'
          }
        }
        return <div key={idx} className={`w-5 h-5 md:w-6 md:h-6 rounded-sm ${cls}`} />
      })}
    </div>
  )
}

/** K/V 缓存块：每步增长一格 */
function CacheBlocks({ step, kind }) {
  return (
    <div>
      <p className="font-mono text-[10px] text-slate-500 mb-1.5">{kind} 缓存</p>
      <div className="flex gap-1">
        {DEMO_SEQ.slice(0, step + 1).map((t, i) => {
          const color = tokenColor(i)
          const isNew = i === step
          return (
            <motion.div
              key={i}
              initial={isNew ? { scale: 0, y: -6 } : false}
              animate={{ scale: 1, y: 0 }}
              className="w-6 h-8 rounded-sm flex items-center justify-center font-mono text-[10px]"
              style={{
                color,
                backgroundColor: `${color}22`,
                border: `1px solid ${color}77`,
                boxShadow: isNew ? `0 0 10px ${color}88` : 'none',
              }}
            >
              {kind}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function KVCacheDemo() {
  const n = DEMO_SEQ.length
  const total = n - 1
  const { step, playing, speed, toggle, next, reset, setSpeed } = usePlayback(total, {
    interval: 1500,
  })
  const naive = noCacheRows(step)
  const cached = step + 1

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        {/* 无缓存 */}
        <div className="rounded-xl border border-slate-700/80 bg-night-soft p-5">
          <p className="font-mono text-xs text-red-400/90 mb-4">✗ 无缓存：每步全量重算</p>
          <div className="flex flex-col items-center gap-4">
            <MiniMatrix step={step} mode="naive" />
            <Counter label="累计计算注意力行" value={naive} tone="red" />
          </div>
        </div>

        {/* 有缓存 */}
        <div className="rounded-xl border border-emerald-500/40 bg-night-soft p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)]">
          <p className="font-mono text-xs text-emerald-400/90 mb-4">✓ 有 KV Cache：每步只算新行</p>
          <div className="flex flex-col items-center gap-4">
            <MiniMatrix step={step} mode="cached" />
            <div className="w-full space-y-3">
              <CacheBlocks step={step} kind="K" />
              <CacheBlocks step={step} kind="V" />
            </div>
            <Counter label="累计计算注意力行" value={cached} tone="green" />
          </div>
        </div>
      </div>

      {/* 底部对比 */}
      <div className="mt-6 rounded-xl border border-slate-800 bg-night-soft/60 px-6 py-4 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 font-mono text-sm">
        <span className="text-slate-400">
          序列长 {step + 1}：无缓存 <b className="text-red-400">{naive}</b> 次 vs 有缓存{' '}
          <b className="text-emerald-400">{cached}</b> 次
        </span>
        <span className="text-slate-600">|</span>
        <span className="bg-gradient-to-r from-red-400 to-emerald-400 bg-clip-text text-transparent font-bold">
          O(n²) → O(n)
        </span>
      </div>

      <div className="flex justify-center mt-6">
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
