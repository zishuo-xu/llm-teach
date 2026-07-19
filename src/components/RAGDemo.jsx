import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RAG_QUESTION, RAG_HALLUCINATED, RAG_DOCS, RAG_GROUNDED } from '../data/hallucination'

/** RAG 对比：不开检索 → 凭记忆瞎编；开检索 → 先查资料再引用回答 */
export default function RAGDemo() {
  const [ragOn, setRagOn] = useState(false)

  return (
    <div>
      {/* 开关 */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className={`text-sm font-mono ${!ragOn ? 'text-red-400' : 'text-slate-500'}`}>
          仅凭记忆
        </span>
        <button
          onClick={() => setRagOn(!ragOn)}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            ragOn ? 'bg-emerald-500/80' : 'bg-slate-700'
          }`}
          aria-label="切换 RAG"
        >
          <motion.span
            animate={{ x: ragOn ? 28 : 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="absolute top-1 w-5 h-5 rounded-full bg-white"
          />
        </button>
        <span className={`text-sm font-mono ${ragOn ? 'text-emerald-400' : 'text-slate-500'}`}>
          RAG · 先检索再回答
        </span>
      </div>

      <p className="text-center font-mono text-sm text-slate-300 mb-5">Q：{RAG_QUESTION}</p>

      {/* 检索资料（仅 RAG 开启时出现） */}
      <AnimatePresence>
        {ragOn && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              {RAG_DOCS.map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="rounded-lg border border-cyan-500/40 bg-cyan-500/5 p-3"
                >
                  <p className="font-mono text-[10px] text-cyan-400 mb-1">
                    📄 检索到资料 [{d.id}] · {d.title}
                  </p>
                  <p className="text-xs text-slate-400 leading-5">{d.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 回答 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={ragOn ? 'grounded' : 'hallucinated'}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className={`rounded-xl border p-5 ${
            ragOn
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : 'border-red-500/40 bg-red-500/5'
          }`}
        >
          <p className={`font-mono text-[10px] mb-2 ${ragOn ? 'text-emerald-400' : 'text-red-400'}`}>
            🤖 模型回答 {ragOn ? '（基于检索资料）' : '（仅凭参数记忆）'}
          </p>
          <p className="text-sm leading-7 text-slate-200">
            {ragOn ? RAG_GROUNDED : RAG_HALLUCINATED}
          </p>
          {!ragOn && (
            <p className="mt-3 pt-3 border-t border-red-500/20 text-xs text-red-400">
              ❌ 工艺、核数、市场、售价 —— 全是编的。这款产品根本不在训练数据里，
              但模型几乎不会主动说「我不知道」。
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
