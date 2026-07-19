import { useState } from 'react'
import { motion } from 'framer-motion'
import { ATT_SENTENCE, ATT_HEADS } from '../data/attention'
import { tokenColor } from '../data/tokens'

const HEAD = ATT_HEADS[0] // 用「指代追踪」头展示射线

/** 注意力射线图：点击一个词，看它在"关注"前面的哪些词 */
export default function AttentionRays() {
  const [query, setQuery] = useState(5) // 默认选「它」
  const n = ATT_SENTENCE.length
  const weights = HEAD.matrix[query]

  // 找最大权重（排除自身）
  let best = -1
  weights.forEach((w, j) => {
    if (w !== null && j !== query && (best === -1 || w > weights[best])) best = j
  })

  // 弧线路径：viewBox 100x36，token 中心 x = (i+0.5)/n*100
  const cx = (i) => ((i + 0.5) / n) * 100
  const arcs = weights
    .map((w, j) => ({ w, j }))
    .filter(({ w, j }) => w !== null && j !== query && w > 0.01)
    .map(({ w, j }) => {
      const x1 = cx(query)
      const x2 = cx(j)
      const h = Math.min(30, 8 + Math.abs(query - j) * 3.2)
      return {
        j,
        w,
        d: `M ${x1} 34 Q ${(x1 + x2) / 2} ${34 - h * 2} ${x2} 34`,
      }
    })

  return (
    <div>
      <p className="font-mono text-xs text-slate-500 mb-2">
        {HEAD.name} · 点击任意一个词，看它的注意力射线
      </p>

      <div className="relative pt-2">
        {/* 弧线层 */}
        <svg
          viewBox="0 0 100 36"
          preserveAspectRatio="none"
          className="w-full h-28 overflow-visible"
        >
          {arcs.map(({ j, w, d }) => (
            <motion.path
              key={`${query}-${j}`}
              d={d}
              fill="none"
              stroke={j === best ? '#22d3ee' : '#818cf8'}
              strokeWidth={0.8 + w * 5}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.15 + w * 0.85 }}
              transition={{ duration: 0.5, delay: (query - j) * 0.06 }}
              style={{ filter: j === best ? 'drop-shadow(0 0 3px rgba(34,211,238,0.8))' : 'none' }}
            />
          ))}
        </svg>

        {/* token 行 */}
        <div className="flex -mt-6">
          {ATT_SENTENCE.map((t, i) => {
            const isQuery = i === query
            const isFuture = i > query
            const color = tokenColor(i)
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <button
                  onClick={() => setQuery(i)}
                  className="px-2 py-1.5 rounded-lg font-mono text-sm md:text-base font-semibold transition-all"
                  style={{
                    color: isFuture ? '#475569' : color,
                    backgroundColor: isQuery ? `${color}33` : `${color}14`,
                    border: `1px solid ${isQuery ? color : `${color}44`}`,
                    boxShadow: isQuery ? `0 0 14px ${color}77` : 'none',
                    transform: isQuery ? 'scale(1.1)' : 'none',
                  }}
                >
                  {t}
                </button>
                {/* 权重百分比 */}
                <span className="font-mono text-[10px] h-3.5" style={{ color: i === best ? '#22d3ee' : '#64748b' }}>
                  {!isFuture && i !== query && weights[i] !== null && weights[i] > 0.01
                    ? `${(weights[i] * 100).toFixed(0)}%`
                    : ''}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <motion.p
        key={query}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-sm text-slate-400"
      >
        「<b style={{ color: tokenColor(query) }}>{ATT_SENTENCE[query]}</b>」
        {best >= 0 && weights[best] > 0.3 ? (
          <>
            最关注「<b className="text-cyan-300">{ATT_SENTENCE[best]}</b>」（
            {(weights[best] * 100).toFixed(0)}%）——
            {query === 5 && best === 0
              ? '原来「它」指的是「小猫」！'
              : '线越粗，代表关注越多。'}
          </>
        ) : (
          '主要关注自身附近。点击「它」试试 👆'
        )}
      </motion.p>
    </div>
  )
}
