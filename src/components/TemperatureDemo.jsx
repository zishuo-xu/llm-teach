import { useState } from 'react'
import { motion } from 'framer-motion'
import { LOGITS, SAMPLING_CONTEXT, softmax } from '../data/sampling'
import { tokenColor } from '../data/tokens'

function verdict(t) {
  if (t <= 0.3) return { text: '接近贪婪解码：几乎永远选最高分的词，输出稳定但呆板', color: '#22d3ee' }
  if (t <= 0.9) return { text: '偏保守：高分词占优，偶尔给低分词机会', color: '#4ade80' }
  if (t <= 1.3) return { text: '原始分布：按模型本来的概率采样', color: '#facc15' }
  return { text: '偏发散：分布被拉平，低分词也有机会 —— 更有创意，也更容易离谱', color: '#f87171' }
}

export default function TemperatureDemo() {
  const [t, setT] = useState(1)
  const probs = softmax(LOGITS.map((l) => l.logit), t)
  const maxProb = Math.max(...probs)
  const v = verdict(t)

  return (
    <div>
      <p className="font-mono text-xs text-slate-500 mb-4">
        上文：「{SAMPLING_CONTEXT}___」 · 模型打分（logit）÷ 温度 T → softmax → 概率
      </p>

      <div className="space-y-2.5">
        {LOGITS.map((l, i) => {
          const p = probs[i]
          const isMax = p === maxProb
          const color = tokenColor(i)
          return (
            <div key={l.token} className="flex items-center gap-3">
              <span
                className="w-12 text-right font-mono text-sm"
                style={{ color: isMax ? color : '#94a3b8' }}
              >
                {l.token}
              </span>
              <span className="w-10 text-right font-mono text-[10px] text-slate-600">
                {l.logit.toFixed(1)}
              </span>
              <div className="flex-1 h-6 rounded bg-slate-800/80 overflow-hidden">
                <motion.div
                  animate={{ width: `${p * 100}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                  className="h-full rounded"
                  style={{
                    background: `linear-gradient(90deg, ${color}55, ${color})`,
                    boxShadow: isMax ? `0 0 12px ${color}66` : 'none',
                  }}
                />
              </div>
              <span
                className="w-14 font-mono text-xs text-right"
                style={{ color: isMax ? color : '#64748b' }}
              >
                {(p * 100).toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>

      {/* 温度滑块 */}
      <div className="mt-8">
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-slate-500 w-16">T = {t.toFixed(1)}</span>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
            className="flex-1 accent-indigo-500"
          />
          <div className="flex gap-1.5">
            {[0.1, 0.7, 1.0, 1.5].map((preset) => (
              <button
                key={preset}
                onClick={() => setT(preset)}
                className={`px-2 py-1 rounded text-xs font-mono border transition-colors ${
                  t === preset
                    ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10'
                    : 'border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
        <motion.p
          key={v.text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm"
          style={{ color: v.color }}
        >
          {v.text}
        </motion.p>
      </div>
    </div>
  )
}
