import { useState } from 'react'
import { motion } from 'framer-motion'
import { LOGITS, SAMPLING_CONTEXT, softmax, topP } from '../data/sampling'
import { tokenColor } from '../data/tokens'

export default function TopPDemo() {
  const [p, setP] = useState(0.9)
  const base = softmax(LOGITS.map((l) => l.logit), 1)

  // 按概率降序排列展示
  const order = base.map((prob, i) => ({ i, prob })).sort((a, b) => b.prob - a.prob)
  const { kept } = topP(base, p)
  const keptCount = kept.size

  let cumulative = 0
  const rows = order.map(({ i, prob }) => {
    cumulative += prob
    return { i, prob, cum: cumulative, isKept: kept.has(i) }
  })

  return (
    <div>
      <p className="font-mono text-xs text-slate-500 mb-4">
        上文：「{SAMPLING_CONTEXT}___」 · 候选按概率降序排列
      </p>

      <div className="space-y-2.5">
        {rows.map(({ i, prob, cum, isKept }) => {
          const color = tokenColor(i)
          return (
            <div key={LOGITS[i].token} className="flex items-center gap-3">
              <span
                className="w-12 text-right font-mono text-sm"
                style={{ color: isKept ? color : '#475569' }}
              >
                {LOGITS[i].token}
              </span>
              <div className="flex-1 h-6 rounded bg-slate-800/80 overflow-hidden relative">
                <motion.div
                  animate={{ width: `${prob * 100}%`, opacity: isKept ? 1 : 0.18 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                  className="h-full rounded"
                  style={{
                    background: `linear-gradient(90deg, ${color}55, ${color})`,
                  }}
                />
                {!isKept && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center pl-2 text-[10px] text-slate-600 font-mono"
                  >
                    ✂ 被截断
                  </motion.span>
                )}
              </div>
              <span className="w-24 font-mono text-[10px] text-right text-slate-500">
                {(prob * 100).toFixed(1)}% · 累 {(cum * 100).toFixed(0)}%
              </span>
            </div>
          )
        })}
      </div>

      {/* p 滑块 */}
      <div className="mt-8">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-slate-500 w-16">p = {p.toFixed(2)}</span>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
            className="flex-1 accent-cyan-500"
          />
          <div className="flex gap-1.5">
            {[0.5, 0.9, 0.95, 1].map((preset) => (
              <button
                key={preset}
                onClick={() => setP(preset)}
                className={`px-2 py-1 rounded text-xs font-mono border transition-colors ${
                  p === preset
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                    : 'border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
        <motion.p
          key={keptCount + '-' + p}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-slate-400"
        >
          p = {p.toFixed(2)} 时，只有前 <b className="text-cyan-300">{keptCount}</b> 个词进入「候选池」，
          池内重新归一化后再采样 —— 尾部那些不靠谱的词被直接剪掉。
        </motion.p>
      </div>
    </div>
  )
}
