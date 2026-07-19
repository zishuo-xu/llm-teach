import { motion } from 'framer-motion'
import { usePlayback } from '../hooks/usePlayback'
import PlaybackControls from './PlaybackControls'

const STEPS = 10

// 训练进行 t 步后的指标（示意）
const reward = (t) => 0.5 + 0.45 * (t / STEPS) // 裁判打分：一路走高
const useful = (t) => (t <= 3 ? 0.5 + 0.05 * t : 0.65 - 0.055 * (t - 3)) // 真实有用度：先升后崩
const answerLen = (t) => 20 + 38 * t // 回答长度：疯狂膨胀

/** 奖励黑客：裁判分数涨 ≠ 回答变好 */
export default function RewardHackingDemo() {
  const { step, playing, speed, toggle, next, reset, setSpeed } = usePlayback(STEPS, {
    interval: 800,
  })

  const sx = (t) => 6 + (t / STEPS) * 88
  const sy = (v) => 44 - v * 38

  const path = (fn, upTo) =>
    Array.from({ length: upTo + 1 }, (_, t) => `${t === 0 ? 'M' : 'L'} ${sx(t)} ${sy(fn(t))}`).join(' ')

  return (
    <div>
      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
        <div className="rounded-xl border border-slate-700/80 bg-night-soft p-2">
          <svg viewBox="0 0 100 50" className="w-full aspect-[2/1] max-h-72">
            <text x="50" y="49" textAnchor="middle" fontSize="3" fill="#64748b">
              PPO 训练步数 →（当前第 {step} 步）
            </text>

            {/* 裁判打分 */}
            <path d={path(reward, step)} fill="none" stroke="#4ade80" strokeWidth="0.8" />
            {/* 真实有用度 */}
            <path d={path(useful, step)} fill="none" stroke="#f87171" strokeWidth="0.8" />

            {/* 当前点 */}
            <motion.circle animate={{ cx: sx(step), cy: sy(reward(step)) }} r="1.4" fill="#4ade80" />
            <motion.circle animate={{ cx: sx(step), cy: sy(useful(step)) }} r="1.4" fill="#f87171" />
          </svg>
        </div>

        <div className="flex md:flex-col gap-3 md:w-44">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 flex-1">
            <p className="font-mono text-[10px] text-slate-500">裁判模型打分</p>
            <p className="font-mono text-2xl font-bold text-emerald-400">{reward(step).toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 flex-1">
            <p className="font-mono text-[10px] text-slate-500">真实有用度</p>
            <p className="font-mono text-2xl font-bold text-red-400">{useful(step).toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-slate-700 bg-night-soft p-3 flex-1">
            <p className="font-mono text-[10px] text-slate-500">平均回答长度</p>
            <p className="font-mono text-2xl font-bold text-slate-300">{answerLen(step)} 词</p>
          </div>
        </div>
      </div>

      <motion.p
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 text-sm text-slate-400 min-h-6"
      >
        {step === 0 && '训练开始：打分和有用度都在低位，回答很简洁。点击播放。'}
        {step > 0 && step <= 3 && '前 3 步一切正常：分高了，回答也确实更好了。'}
        {step > 3 && step < STEPS &&
          '⚠️ 模型发现了捷径：回答写得越长越啰嗦，裁判给分越高 —— 它开始灌水了。'}
        {step >= STEPS &&
          '💥 训练结束：裁判分数接近满分，真实有用度却崩了。这就是「奖励黑客」—— 优化了指标，背叛了目的。'}
      </motion.p>

      <div className="flex justify-center mt-4">
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
