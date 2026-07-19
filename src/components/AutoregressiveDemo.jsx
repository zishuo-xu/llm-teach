import { motion, AnimatePresence } from 'framer-motion'
import { generationScript, tokenColor } from '../data/tokens'
import { usePlayback } from '../hooks/usePlayback'
import PlaybackControls from './PlaybackControls'
import { TokenChip } from './TokenChips'

const { prompt, steps } = generationScript

export default function AutoregressiveDemo() {
  const total = steps.length
  const { step, playing, speed, toggle, next, reset, setSpeed } = usePlayback(total, {
    interval: 2000,
  })

  const contextTokens = [...prompt, ...steps.slice(0, step).map((s) => s.token)]
  const current = step < total ? steps[step] : null

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6 items-stretch">
        {/* 左：上下文窗口 */}
        <div className="rounded-xl border border-slate-700/80 bg-night-soft p-5 flex flex-col">
          <p className="font-mono text-xs text-slate-500 mb-4">模型当前看到的上下文</p>
          <div className="flex flex-wrap gap-2 content-start flex-1">
            {contextTokens.map((t, i) => {
              const isNew = i === contextTokens.length - 1 && step > 0
              return (
                <TokenChip
                  key={`${i}-${t}`}
                  text={t}
                  index={i}
                  size="md"
                  highlight={isNew}
                />
              )
            })}
            {current && (
              <motion.span
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="self-center text-cyan-300 font-mono text-lg"
              >
                ▍
              </motion.span>
            )}
          </div>
          {/* 循环箭头：输出接回输入 */}
          <motion.p
            animate={{ opacity: step > 0 ? 1 : 0.25 }}
            className="mt-4 pt-3 border-t border-slate-800 font-mono text-xs text-cyan-300/80"
          >
            ↺ 新生成的 token 会被接回上下文，作为下一步的输入
          </motion.p>
        </div>

        {/* 右：下一个 token 候选概率 */}
        <div className="rounded-xl border border-slate-700/80 bg-night-soft p-5">
          <p className="font-mono text-xs text-slate-500 mb-4">
            {current ? '预测下一个 token（候选概率）' : '生成结束'}
          </p>
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="space-y-3"
              >
                {current.candidates.map((c, i) => {
                  const chosen = i === 0
                  return (
                    <div key={c.token} className="flex items-center gap-3">
                      <span
                        className={`w-14 text-right font-mono text-sm ${
                          chosen ? 'text-cyan-300 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        {c.token}
                      </span>
                      <div className="flex-1 h-5 rounded bg-slate-800 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c.prob * 100}%` }}
                          transition={{ duration: 0.6, delay: i * 0.08 }}
                          className={`h-full rounded ${
                            chosen
                              ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                              : 'bg-slate-600'
                          }`}
                        />
                      </div>
                      <span className="w-12 font-mono text-xs text-slate-500">
                        {Math.round(c.prob * 100)}%
                      </span>
                    </div>
                  )
                })}
                <p className="pt-2 font-mono text-xs text-slate-500">
                  → 选中概率最高的「
                  <span style={{ color: tokenColor(prompt.length + step) }}>{current.token}</span>
                  」，追加到上下文
                </p>
              </motion.div>
            ) : (
              <motion.p
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-400 text-sm"
              >
                ✅ 完整输出：「{prompt.join('') + ' → ' + steps.map((s) => s.token).join('')}」
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center mt-6">
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
