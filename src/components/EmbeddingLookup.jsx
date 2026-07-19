import { motion } from 'framer-motion'
import { tokenColor } from '../data/tokens'

// 示意：词表里的几行（id → 向量），「猫」那行被查出
const ROWS = [
  { id: 8821, token: '狗', dim: null },
  { id: 8822, token: '跑', dim: null },
  { id: 8823, token: '猫', dim: [0.12, -0.84, 0.35, 0.67, -0.29, 0.91, 0.05, -0.48], hit: true },
  { id: 8824, token: '桌子', dim: null },
  { id: 8825, token: '蓝色', dim: null },
]

/** Embedding 查表动画：token → id → 词表中的一行向量 */
export default function EmbeddingLookup() {
  return (
    <div className="grid md:grid-cols-[auto_auto_1fr] gap-6 items-center">
      {/* 输入 token */}
      <div className="flex flex-col items-center gap-1.5">
        <span
          className="px-4 py-2 rounded-lg font-mono font-semibold text-lg"
          style={{
            color: tokenColor(0),
            backgroundColor: `${tokenColor(0)}1a`,
            border: `1px solid ${tokenColor(0)}66`,
          }}
        >
          猫
        </span>
        <span className="font-mono text-[10px] text-slate-500">token</span>
      </div>

      <div className="flex flex-col items-center gap-1.5 font-mono">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-slate-200"
        >
          8823
        </motion.span>
        <span className="text-[10px] text-slate-500">id → 查表 →</span>
      </div>

      {/* Embedding 表 */}
      <div className="rounded-xl border border-slate-700/80 bg-night-soft p-4 overflow-x-auto">
        <p className="font-mono text-[10px] text-slate-500 mb-2">
          Embedding 表（词表中每个 id 对应一行向量）
        </p>
        <div className="space-y-1 font-mono text-xs">
          {ROWS.map((row, i) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.12 }}
              className={`flex items-center gap-3 px-2 py-1.5 rounded ${
                row.hit
                  ? 'bg-indigo-500/15 border border-indigo-400/50'
                  : 'border border-transparent opacity-50'
              }`}
            >
              <span className={row.hit ? 'text-indigo-300' : 'text-slate-500'}>{row.id}</span>
              <span className="text-slate-600 w-10">{row.token}</span>
              {row.hit ? (
                <span className="flex gap-1.5">
                  {row.dim.map((v, j) => (
                    <motion.span
                      key={j}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + j * 0.08 }}
                      className={v >= 0 ? 'text-cyan-300' : 'text-violet-300'}
                    >
                      {v.toFixed(2)}
                    </motion.span>
                  ))}
                </span>
              ) : (
                <span className="text-slate-600">[ ············ ]</span>
              )}
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4 }}
          className="mt-3 text-xs text-slate-500"
        >
          真实模型的向量有几百到上万个维度（这里只画 8 维），它就是这个词的「数字指纹」。
        </motion.p>
      </div>
    </div>
  )
}
