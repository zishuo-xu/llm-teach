import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { LOGITS, SAMPLING_CONTEXT, softmax } from '../data/sampling'
import { tokenColor } from '../data/tokens'
import { usePlayback } from '../hooks/usePlayback'
import { makeRandomStream } from '../utils/random'
import PlaybackControls from './PlaybackControls'

const TOTAL_SAMPLES = 60

export default function SamplingDemo() {
  const [t, setT] = useState(1)
  const probs = useMemo(() => softmax(LOGITS.map((l) => l.logit), t), [t])
  const { step, playing, speed, toggle, next, reset, setSpeed } = usePlayback(TOTAL_SAMPLES, {
    interval: 150,
  })

  // 温度变化时重新计数，避免不同分布的样本混在一起
  const changeT = (v) => {
    setT(v)
    reset()
  }

  // 由 step 个数推导采样计数（纯函数，渲染安全）
  const counts = useMemo(() => {
    const rand = makeRandomStream(42)
    const acc = new Array(LOGITS.length).fill(0)
    for (let i = 0; i < step; i++) {
      const r = rand()
      let cum = 0
      for (let k = 0; k < probs.length; k++) {
        cum += probs[k]
        if (r < cum) {
          acc[k]++
          break
        }
      }
    }
    return acc
  }, [step, probs])

  const lastToken = useMemo(() => {
    if (step === 0) return null
    const rand = makeRandomStream(42)
    let r = 0
    for (let i = 0; i < step; i++) r = rand()
    let cum = 0
    for (let k = 0; k < probs.length; k++) {
      cum += probs[k]
      if (r < cum) return k
    }
    return probs.length - 1
  }, [step, probs])

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="font-mono text-xs text-slate-500">当前温度：</span>
        {[0.2, 1.0, 2.0].map((v) => (
          <button
            key={v}
            onClick={() => changeT(v)}
            className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${
              t === v
                ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10'
                : 'border-slate-700 text-slate-500 hover:border-slate-500'
            }`}
          >
            T = {v}
          </button>
        ))}
        <span className="font-mono text-xs text-slate-600 ml-auto">
          已采样 {step} / {TOTAL_SAMPLES} 次
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 贪婪解码 */}
        <div className="rounded-xl border border-slate-700/80 bg-night-soft p-5">
          <p className="font-mono text-xs text-cyan-300/90 mb-3">贪婪解码：永远选最高分</p>
          <p className="text-lg text-slate-200 font-mono">
            {SAMPLING_CONTEXT}
            <span className="text-cyan-300">好</span>
          </p>
          <p className="mt-4 text-sm text-slate-500 leading-6">
            无论跑多少次，结果都一样。稳定、可控 —— 但也千篇一律。
          </p>
        </div>

        {/* 采样解码 */}
        <div className="rounded-xl border border-indigo-500/40 bg-night-soft p-5">
          <p className="font-mono text-xs text-indigo-300/90 mb-3">采样解码：按概率掷骰子</p>
          <p className="text-lg text-slate-200 font-mono min-h-7">
            {SAMPLING_CONTEXT}
            {lastToken !== null && (
              <motion.span
                key={step}
                initial={{ opacity: 0, scale: 1.6 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ color: tokenColor(lastToken) }}
              >
                {LOGITS[lastToken].token}
              </motion.span>
            )}
          </p>
          {/* 频率直方图 */}
          <div className="mt-4 space-y-1.5">
            {LOGITS.map((l, i) => (
              <div key={l.token} className="flex items-center gap-2">
                <span className="w-10 text-right font-mono text-xs text-slate-400">{l.token}</span>
                <div className="flex-1 h-3.5 rounded bg-slate-800/80 overflow-hidden">
                  <motion.div
                    animate={{ width: step ? `${(counts[i] / step) * 100}%` : '0%' }}
                    className="h-full rounded"
                    style={{ backgroundColor: tokenColor(i) }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-[10px] text-slate-500">
                  {counts[i]}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            多掷几次你会发现：被选中的频率越来越接近概率分布本身。
          </p>
        </div>
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
