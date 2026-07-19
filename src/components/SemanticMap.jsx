import { useState } from 'react'
import { motion } from 'framer-motion'
import { SEMANTIC_WORDS, CLUSTER_COLORS, dist } from '../data/embedding'

/** 二维语义地图：点击一个词，连线到最近的两个邻居 */
export default function SemanticMap() {
  const [selected, setSelected] = useState(null) // word object

  const neighbors = selected
    ? SEMANTIC_WORDS.filter((w) => w.word !== selected.word)
        .map((w) => ({ ...w, d: dist(w, selected) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
    : []

  // svg 坐标：y 翻转（数据 y 向上，svg y 向下）
  const sy = (y) => 100 - y

  return (
    <div>
      <p className="font-mono text-xs text-slate-500 mb-3">
        点击任意一个词，看离它最近的两个「邻居」
      </p>

      <div className="rounded-xl border border-slate-700/80 bg-night-soft p-2">
        <svg viewBox="0 0 100 100" className="w-full aspect-square max-h-105">
          {/* 近邻连线 */}
          {neighbors.map((nb) => (
            <motion.line
              key={nb.word}
              x1={selected.x}
              y1={sy(selected.y)}
              x2={nb.x}
              y2={sy(nb.y)}
              stroke="#22d3ee"
              strokeWidth={0.4}
              strokeDasharray="1.5 1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
            />
          ))}

          {/* 词点 */}
          {SEMANTIC_WORDS.map((w, i) => {
            const color = CLUSTER_COLORS[w.cluster]
            const isSel = selected?.word === w.word
            const isNeighbor = neighbors.some((nb) => nb.word === w.word)
            const dim = selected && !isSel && !isNeighbor
            return (
              <motion.g
                key={w.word}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: dim ? 0.35 : 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(isSel ? null : w)}
                className="cursor-pointer"
                style={{ transformOrigin: `${w.x}px ${sy(w.y)}px` }}
              >
                <circle
                  cx={w.x}
                  cy={sy(w.y)}
                  r={isSel ? 3 : 2}
                  fill={color}
                  opacity={0.25}
                />
                <circle
                  cx={w.x}
                  cy={sy(w.y)}
                  r={1.1}
                  fill={color}
                  style={isSel || isNeighbor ? { filter: `drop-shadow(0 0 2px ${color})` } : undefined}
                />
                <text
                  x={w.x}
                  y={sy(w.y) - 2.6}
                  textAnchor="middle"
                  fontSize="3.2"
                  fill={isSel ? '#fff' : color}
                  fontWeight={isSel ? 700 : 400}
                >
                  {w.word}
                </text>
              </motion.g>
            )
          })}
        </svg>
      </div>

      {/* 图例 + 结论 */}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {Object.entries(CLUSTER_COLORS).map(([name, color]) => (
          <span key={name} className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            {name}
          </span>
        ))}
      </div>
      <motion.p
        key={selected?.word ?? 'none'}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 text-sm text-slate-400 min-h-6"
      >
        {selected ? (
          <>
            离「<b className="text-slate-100">{selected.word}</b>」最近的是
            {neighbors.map((nb) => (
              <b key={nb.word} className="text-cyan-300">「{nb.word}」 </b>
            ))}
            —— 意思相近的词，在向量空间里也住得近。
          </>
        ) : (
          '词的位置不是人摆的，是模型从海量文本里「住出来的」。'
        )}
      </motion.p>
    </div>
  )
}
