import { motion } from 'framer-motion'

/** 残差连接示意图：x 既走变换主线，也走旁路直达，最后相加 */
export default function ResidualDiagram() {
  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-5 py-2 rounded-lg border border-slate-600 bg-night-soft font-mono text-sm text-slate-200"
      >
        输出 = F(x) + x
      </motion.div>
      <div className="flex items-center gap-6 text-slate-600">
        <span>↑</span>
        <span className="mx-10">↑</span>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="px-5 py-3 rounded-lg border border-indigo-400/50 bg-indigo-500/10 font-mono text-sm text-indigo-200"
      >
        注意力 / 前馈网络 F(x)
      </motion.div>
      <div className="flex items-center gap-6 text-slate-600">
        <span>↑</span>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mx-10 text-cyan-400 font-mono text-xs"
        >
          ↑ 旁路：x 原样抄近道
        </motion.span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="px-5 py-2 rounded-lg border border-slate-600 bg-night-soft font-mono text-sm text-slate-200"
      >
        输入 x
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.45 }}
        className="mt-3 text-xs text-slate-500 max-w-md text-center leading-5"
      >
        层只学习「要改多少」（F(x)），原始信息走旁路原样保留。
        没有这条高速公路，96 层的梯度在反向传播时会一路衰减到消失。
        每个子层前后还配有 LayerNorm 稳住数值范围 —— 它们是深网络能训练的工程基石。
      </motion.p>
    </div>
  )
}
