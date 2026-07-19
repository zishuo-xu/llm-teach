import { motion } from 'framer-motion'
import { ATT_SENTENCE, ATT_HEADS } from '../data/attention'
import AttentionMatrix from './AttentionMatrix'

/** 多头对比：三个头并排，各自关注不同的关系 */
export default function MultiHeadDemo() {
  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6">
        {ATT_HEADS.map((h, i) => (
          <motion.div
            key={h.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.15 }}
            className="rounded-xl border border-slate-700/80 bg-night-soft p-4 flex flex-col items-center gap-3"
          >
            <p className="font-mono text-xs text-indigo-300">{h.name}</p>
            <AttentionMatrix matrix={h.matrix} tokens={ATT_SENTENCE} size="sm" />
            <p className="text-xs text-slate-500 text-center leading-5">{h.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-night-soft/60 px-6 py-4 text-sm text-slate-400 leading-7 text-center">
        真实模型有几十到上百个头同时工作，各学各的「关系」，最后把大家的发现拼接起来 ——
        这就是 <b className="text-slate-200">Multi-Head Attention</b>。
      </div>
    </div>
  )
}
