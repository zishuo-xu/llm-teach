import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { tokenizeExamples } from '../data/tokens'
import { usePlayback } from '../hooks/usePlayback'
import PlaybackControls from './PlaybackControls'
import { TokenChip } from './TokenChips'

export default function TokenizeDemo() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const example = tokenizeExamples[exampleIdx]
  const n = example.tokens.length
  const { step, playing, speed, toggle, next, reset, setSpeed } = usePlayback(n, { interval: 1200 })

  const switchExample = (i) => {
    setExampleIdx(i)
    reset()
  }

  return (
    <div>
      {/* 例句切换 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tokenizeExamples.map((ex, i) => (
          <button
            key={ex.label}
            onClick={() => switchExample(i)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
              i === exampleIdx
                ? 'bg-indigo-500/20 border-indigo-400/60 text-indigo-200'
                : 'border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* 舞台 */}
      <div className="min-h-44 flex flex-col items-center justify-center gap-8 py-6">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="sentence"
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
              className="text-2xl md:text-3xl font-medium text-slate-100 font-mono"
            >
              “{example.text}”
            </motion.div>
          ) : (
            <motion.div key="tokens" className="flex flex-wrap justify-center gap-3">
              {example.tokens.slice(0, step).map((t, i) => (
                <div key={`${example.label}-${i}`} className="flex flex-col items-center gap-1">
                  <TokenChip text={t.text} index={i} id={t.id} size="lg" />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          animate={{ opacity: step > 0 ? 1 : 0 }}
          className="font-mono text-xs text-slate-500"
        >
          {step > 0 && `已切出 ${step} / ${n} 个 token，每个 token 对应词表里的一个 id`}
        </motion.p>
      </div>

      <div className="flex justify-center">
        <PlaybackControls
          playing={playing}
          speed={speed}
          onToggle={toggle}
          onNext={next}
          onReset={reset}
          onSpeed={setSpeed}
        />
      </div>
    </div>
  )
}
