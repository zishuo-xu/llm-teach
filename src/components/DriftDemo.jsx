import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { DRIFT_QUESTION, DRIFT_CANDIDATES } from '../data/hallucination'
import { softmax } from '../data/sampling'
import { usePlayback } from '../hooks/usePlayback'
import { makeRandomStream } from '../utils/random'
import PlaybackControls from './PlaybackControls'

const TOTAL_RUNS = 30

/** 采样漂移实验：同一个事实问题跑 30 次，看答案怎么"跑偏" */
export default function DriftDemo() {
  const [t, setT] = useState(1)
  const probs = useMemo(() => softmax(DRIFT_CANDIDATES.map((c) => c.logit), t), [t])
  const { step, playing, speed, toggle, next, reset, setSpeed } = usePlayback(TOTAL_RUNS, {
    interval: 400,
  })

  const changeT = (v) => {
    setT(v)
    reset()
  }

  // 由 step 纯函数推导已跑结果
  const runs = useMemo(() => {
    const rand = makeRandomStream(7)
    const out = []
    for (let i = 0; i < step; i++) {
      const r = rand()
      let cum = 0
      for (let k = 0; k < probs.length; k++) {
        cum += probs[k]
        if (r < cum) {
          out.push(k)
          break
        }
      }
      if (out.length <= i) out.push(probs.length - 1)
    }
    return out
  }, [step, probs])

  const wrongCount = runs.filter((k) => !DRIFT_CANDIDATES[k].correct).length
  const last = runs.length > 0 ? runs[runs.length - 1] : null

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <p className="font-mono text-sm text-slate-300">Q：{DRIFT_QUESTION}</p>
        <div className="flex gap-1.5 ml-auto">
          {[0.5, 1.0, 2.0].map((v) => (
            <button
              key={v}
              onClick={() => changeT(v)}
              className={`px-2.5 py-1 rounded-full text-xs font-mono border transition-colors ${
                t === v
                  ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10'
                  : 'border-slate-700 text-slate-500 hover:border-slate-500'
              }`}
            >
              T={v}
            </button>
          ))}
        </div>
      </div>

      {/* 当前概率分布 */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5 font-mono text-[11px] text-slate-500">
        {DRIFT_CANDIDATES.map((c, i) => (
          <span key={c.token}>
            {c.token} <span className={c.correct ? 'text-emerald-400' : 'text-red-400/80'}>{(probs[i] * 100).toFixed(0)}%</span>
          </span>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
        {/* 跑道：每次运行的结果 */}
        <div>
          <p className="font-mono text-xs text-slate-500 mb-2">
            第 {runs.length} / {TOTAL_RUNS} 次运行
          </p>
          <div className="rounded-xl border border-slate-700/80 bg-night-soft p-4 min-h-16 flex items-center">
            {last !== null ? (
              <motion.p
                key={runs.length}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`font-mono text-lg ${DRIFT_CANDIDATES[last].correct ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {DRIFT_CANDIDATES[last].correct ? '✓' : '✗'} {DRIFT_CANDIDATES[last].token}
                {!DRIFT_CANDIDATES[last].correct && (
                  <span className="text-xs text-slate-500 ml-2">← 这次跑偏了</span>
                )}
              </motion.p>
            ) : (
              <p className="text-sm text-slate-600">点击播放，开始连续采样…</p>
            )}
          </div>
          {/* 历史点阵 */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {runs.map((k, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`w-3.5 h-3.5 rounded-full ${
                  DRIFT_CANDIDATES[k].correct
                    ? 'bg-emerald-500/80'
                    : 'bg-red-500/90 shadow-[0_0_6px_rgba(239,68,68,0.7)]'
                }`}
                title={`第${i + 1}次：${DRIFT_CANDIDATES[k].token}`}
              />
            ))}
          </div>
        </div>

        {/* 统计 */}
        <div className="flex md:flex-col gap-3">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-center min-w-24">
            <p className="font-mono text-2xl font-bold text-emerald-400">{runs.length - wrongCount}</p>
            <p className="font-mono text-[10px] text-slate-500">答对</p>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-center min-w-24">
            <motion.p key={wrongCount} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="font-mono text-2xl font-bold text-red-400">
              {wrongCount}
            </motion.p>
            <p className="font-mono text-[10px] text-slate-500">幻觉</p>
          </div>
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
