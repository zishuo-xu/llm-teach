import { useState } from 'react'
import { motion } from 'framer-motion'

const MODELS = [
  { name: 'GPT-2 small', layers: 12, params: '1.2 亿', note: '2019 年的"小"模型' },
  { name: 'Llama 3 70B', layers: 80, params: '700 亿', note: '主流开源大模型' },
  { name: 'GPT-3', layers: 96, params: '1750 亿', note: '2020 年的里程碑' },
]

/** 层数堆叠：同一个 Transformer 块叠几十上百次 */
export default function LayerStackDemo() {
  const [modelIdx, setModelIdx] = useState(0)
  const model = MODELS[modelIdx]

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {MODELS.map((m, i) => (
          <button
            key={m.name}
            onClick={() => setModelIdx(i)}
            className={`px-3 py-1.5 rounded-full text-sm font-mono transition-colors border ${
              i === modelIdx
                ? 'bg-indigo-500/20 border-indigo-400/60 text-indigo-200'
                : 'border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
        {/* 堆叠动画 */}
        <div className="mx-auto w-40">
          <div className="flex flex-col-reverse gap-[2px]">
            {Array.from({ length: model.layers }, (_, i) => (
              <motion.div
                key={`${model.name}-${i}`}
                initial={{ opacity: 0, scaleX: 0.4 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: Math.min(i * 0.02, 1.5), duration: 0.2 }}
                className="h-[5px] rounded-sm"
                style={{
                  background: `linear-gradient(90deg, rgba(99,102,241,${0.4 + (i / model.layers) * 0.6}), rgba(34,211,238,${0.4 + (i / model.layers) * 0.6}))`,
                }}
              />
            ))}
          </div>
          <motion.p
            key={model.layers}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-center font-mono text-sm text-cyan-300"
          >
            × {model.layers} 层
          </motion.p>
        </div>

        {/* 说明 */}
        <div className="space-y-4">
          <motion.div
            key={model.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-slate-700/80 bg-night-soft p-5"
          >
            <p className="font-mono text-[10px] text-slate-500">{model.name} · {model.note}</p>
            <p className="mt-1 font-mono text-3xl font-bold bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              {model.params}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">参数规模（每个参数就是一个可被训练拧动的旋钮）</p>
          </motion.div>
          <p className="text-sm text-slate-400 leading-7">
            每一层的结构完全一样（注意力 + 前馈），但分工大致不同：
            <b className="text-slate-200">底层</b>管语法和表面搭配，
            <b className="text-slate-200">中层</b>管语义和指代，
            <b className="text-slate-200">高层</b>管抽象推理 ——
            层层接力，简单的零件叠出了复杂的能力。
          </p>
        </div>
      </div>
    </div>
  )
}
