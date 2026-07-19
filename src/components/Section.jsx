import { motion } from 'framer-motion'

/**
 * 章节通用布局：序号 + 标题 + 讲解文字 + 动画舞台
 */
export default function Section({ id, index, title, children, stage, wide = false }) {
  return (
    <section id={id} className="scroll-mt-20 py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className={`mx-auto ${wide ? 'max-w-6xl' : 'max-w-4xl'}`}
      >
        <p className="font-mono text-indigo-400/80 text-sm tracking-widest mb-3">{index}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6">{title}</h2>
        <div className="text-slate-400 leading-8 space-y-4 mb-10">{children}</div>
        {stage && (
          <div className="rounded-2xl border border-slate-800 bg-night-card/80 p-6 md:p-8 shadow-[0_0_40px_rgba(30,41,82,0.35)]">
            {stage}
          </div>
        )}
      </motion.div>
    </section>
  )
}
