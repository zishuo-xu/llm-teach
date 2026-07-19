import { motion } from 'framer-motion'
import { usePlayback } from '../hooks/usePlayback'
import { DEMO_SEQ, noCacheRows } from '../data/cache'
import PlaybackControls from './PlaybackControls'

export default function NoCacheDemo() {
  const n = DEMO_SEQ.length
  const total = n - 1
  const { step, playing, speed, toggle, next, reset, setSpeed } = usePlayback(total, {
    interval: 1500,
  })

  return (
    <div>
      <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
        {/* 注意力矩阵 */}
        <div className="mx-auto">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${n}, minmax(0,1fr))` }}
          >
            {Array.from({ length: n * n }, (_, idx) => {
              const r = Math.floor(idx / n)
              const c = idx % n
              const valid = c <= r && r <= step
              const recomputed = valid && r < step // 历史行：被白白重算
              const isNewRow = valid && r === step // 本步新算的一行
              return (
                <motion.div
                  key={idx}
                  animate={
                    recomputed
                      ? { opacity: [0.45, 1, 0.45] }
                      : { opacity: valid ? 1 : 0.12 }
                  }
                  transition={
                    recomputed
                      ? { duration: 0.9, repeat: Infinity, delay: (r + c) * 0.05 }
                      : { duration: 0.3 }
                  }
                  className={`w-8 h-8 md:w-9 md:h-9 rounded ${
                    !valid
                      ? 'bg-slate-800/50'
                      : isNewRow
                        ? 'bg-cyan-400/90 shadow-[0_0_10px_rgba(34,211,238,0.6)]'
                        : 'bg-red-500/70'
                  }`}
                />
              )
            })}
          </div>
          <div className="mt-3 flex gap-4 font-mono text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-500/70" /> 被重复计算
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400/90" /> 真正需要的新行
            </span>
          </div>
        </div>

        {/* 计数与说明 */}
        <div className="space-y-5">
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
            <p className="font-mono text-xs text-slate-500 mb-1">已累计计算注意力行</p>
            <motion.p
              key={step}
              initial={{ scale: 1.15, color: '#fca5a5' }}
              animate={{ scale: 1, color: '#f87171' }}
              className="font-mono text-5xl font-bold"
            >
              {noCacheRows(step)}
            </motion.p>
            <p className="mt-2 text-sm text-slate-400">
              生成第 {step + 1} 个 token 时，前面 {step + 1} 行全部重算了一遍
            </p>
          </div>
          <p className="text-sm text-slate-400 leading-7">
            其实历史 token 的 K、V 向量在上一步就已经算过，结果一模一样 ——
            红色格子全是<b className="text-slate-200">重复劳动</b>。序列越长，浪费越夸张：
            这就是 O(n²) 的代价。
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-8">
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
