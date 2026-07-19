import { useState } from 'react'
import { motion } from 'framer-motion'
import { ATT_SENTENCE, ATT_HEADS } from '../data/attention'
import AttentionMatrix from './AttentionMatrix'

/** 注意力矩阵热力图：可切换头、可点选格子，展示因果遮罩 */
export default function AttentionMatrixDemo() {
  const [headIdx, setHeadIdx] = useState(0)
  const [sel, setSel] = useState([5, 0])
  const head = ATT_HEADS[headIdx]

  const switchHead = (i) => {
    setHeadIdx(i)
    setSel(null)
  }

  return (
    <div>
      {/* 头切换 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ATT_HEADS.map((h, i) => (
          <button
            key={h.name}
            onClick={() => switchHead(i)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
              i === headIdx
                ? 'bg-indigo-500/20 border-indigo-400/60 text-indigo-200'
                : 'border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            {h.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
        <div className="mx-auto overflow-x-auto">
          <AttentionMatrix
            matrix={head.matrix}
            tokens={ATT_SENTENCE}
            selected={sel}
            onSelect={setSel}
          />
        </div>

        <div className="space-y-4">
          <motion.p
            key={headIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-slate-400 leading-7"
          >
            {head.desc}
          </motion.p>

          {/* 选中格详情 */}
          <div className="rounded-xl border border-slate-700/80 bg-night-soft p-4 min-h-20">
            {sel && head.matrix[sel[0]][sel[1]] !== null ? (
              <motion.p
                key={`${headIdx}-${sel}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-sm text-slate-300"
              >
                「{ATT_SENTENCE[sel[0]]}」看向「{ATT_SENTENCE[sel[1]]}」的注意力：
                <span className="text-cyan-300 text-xl font-bold ml-2">
                  {(head.matrix[sel[0]][sel[1]] * 100).toFixed(0)}%
                </span>
              </motion.p>
            ) : (
              <p className="text-sm text-slate-500">点击矩阵中的格子，查看具体权重</p>
            )}
          </div>

          {/* 因果遮罩说明 */}
          <div className="rounded-xl border border-slate-800 bg-night-soft/60 p-4">
            <p className="font-mono text-xs text-slate-500 mb-1.5">■ 灰色上三角 = 因果遮罩</p>
            <p className="text-sm text-slate-400 leading-6">
              生成第 i 个词时，它<b className="text-slate-200">不能偷看后面的词</b>
              （否则就是开卷考试了）。所以每个词只能关注自己和之前的内容 ——
              这也正是第一期里 KV Cache 只需要缓存历史 K/V 的原因。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
