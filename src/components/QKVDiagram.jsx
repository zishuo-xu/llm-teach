import { motion } from 'framer-motion'
import { tokenColor } from '../data/tokens'

const ITEMS = [
  {
    key: 'Q',
    name: 'Query · 提问',
    desc: '「我在找什么？」—— 每个词拿着它去和别人的 Key 匹配',
    color: '#22d3ee',
    analogy: '像图书馆里你手里的检索条',
  },
  {
    key: 'K',
    name: 'Key · 标签',
    desc: '「我是什么？」—— 每个词贴出来的自我介绍',
    color: '#a78bfa',
    analogy: '像每本书书脊上的分类标签',
  },
  {
    key: 'V',
    name: 'Value · 内容',
    desc: '「我有什么干货？」—— 真正被取走的信息',
    color: '#4ade80',
    analogy: '像书里的正文内容',
  },
]

/** Q/K/V 概念图：token 向量 × 三个矩阵 → 三种角色 */
export default function QKVDiagram() {
  return (
    <div className="grid md:grid-cols-[1fr_auto_2fr] gap-6 items-center">
      {/* 输入 token */}
      <div className="flex flex-col items-center gap-2">
        <span
          className="px-4 py-2 rounded-lg font-mono font-semibold text-lg"
          style={{
            color: tokenColor(0),
            backgroundColor: `${tokenColor(0)}1a`,
            border: `1px solid ${tokenColor(0)}66`,
          }}
        >
          它
        </span>
        <span className="font-mono text-[10px] text-slate-500">token 向量</span>
      </div>

      {/* 变换 */}
      <div className="flex md:flex-col gap-2 justify-center font-mono text-[10px] text-slate-500">
        {['×W_Q', '×W_K', '×W_V'].map((m, i) => (
          <motion.span
            key={m}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.2 }}
            className="px-2 py-1 rounded border border-slate-700 bg-slate-800/60"
          >
            {m}
          </motion.span>
        ))}
      </div>

      {/* 三种角色 */}
      <div className="space-y-3">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.2 }}
            className="rounded-xl border p-4"
            style={{ borderColor: `${item.color}44`, backgroundColor: `${item.color}0d` }}
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-2xl font-bold" style={{ color: item.color }}>
                {item.key}
              </span>
              <span className="font-medium text-slate-200">{item.name}</span>
            </div>
            <p className="mt-1.5 text-sm text-slate-400 leading-6">{item.desc}</p>
            <p className="mt-1 text-xs text-slate-500 font-mono">{item.analogy}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
