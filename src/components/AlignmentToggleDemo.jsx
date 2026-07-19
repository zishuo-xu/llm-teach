import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ALIGN_QUESTION,
  BASE_ANSWER,
  BASE_NOTE,
  ALIGNED_ANSWER,
  ALIGNED_NOTE,
} from '../data/alignment'

/** 预训练模型 vs 对齐模型：同一个问题的回答对比 */
export default function AlignmentToggleDemo() {
  const [aligned, setAligned] = useState(false)

  return (
    <div>
      {/* 开关 */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className={`text-sm font-mono ${!aligned ? 'text-orange-400' : 'text-slate-500'}`}>
          预训练模型
        </span>
        <button
          onClick={() => setAligned(!aligned)}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            aligned ? 'bg-emerald-500/80' : 'bg-slate-700'
          }`}
          aria-label="切换对齐"
        >
          <motion.span
            animate={{ x: aligned ? 28 : 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="absolute top-1 w-5 h-5 rounded-full bg-white"
          />
        </button>
        <span className={`text-sm font-mono ${aligned ? 'text-emerald-400' : 'text-slate-500'}`}>
          对齐后
        </span>
      </div>

      <p className="text-center font-mono text-sm text-slate-300 mb-5">Q：{ALIGN_QUESTION}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={aligned ? 'aligned' : 'base'}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className={`rounded-xl border p-5 ${
            aligned ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-orange-500/40 bg-orange-500/5'
          }`}
        >
          <p className={`font-mono text-[10px] mb-2 ${aligned ? 'text-emerald-400' : 'text-orange-400'}`}>
            🤖 {aligned ? '对齐后的回答' : '预训练模型的「回答」'}
          </p>
          <p className="text-sm leading-7 text-slate-200 whitespace-pre-line">
            {aligned ? ALIGNED_ANSWER : BASE_ANSWER}
          </p>
          <p className={`mt-3 pt-3 border-t text-xs leading-5 ${
            aligned ? 'border-emerald-500/20 text-emerald-300/80' : 'border-orange-500/20 text-orange-300/80'
          }`}>
            {aligned ? '✅ ' : '❌ '}{aligned ? ALIGNED_NOTE : BASE_NOTE}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
