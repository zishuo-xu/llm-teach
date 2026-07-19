import { useState } from 'react'
import { motion } from 'framer-motion'

/**
 * 损失函数交互曲线：loss = -ln(p)
 * p = 模型给正确答案的概率；p 越接近 1，损失越接近 0
 */
export default function LossDemo() {
  const [p, setP] = useState(0.3)
  const loss = -Math.log(p)

  // 曲线绘制区：p ∈ [0.02, 1] → x ∈ [8, 96]；loss ∈ [0, 4] → y ∈ [88, 12]（y 翻转）
  const px = (prob) => 8 + prob * 88
  const ly = (l) => 88 - (Math.min(l, 4) / 4) * 76

  const curve = Array.from({ length: 60 }, (_, i) => {
    const prob = 0.02 + (i / 59) * 0.98
    return `${i === 0 ? 'M' : 'L'} ${px(prob)} ${ly(-Math.log(prob))}`
  }).join(' ')

  return (
    <div>
      <p className="font-mono text-xs text-slate-500 mb-4">
        正确答案是「思考」。拖动滑块，模拟模型给它分配的概率 —— 看损失怎么变。
      </p>

      <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div className="rounded-xl border border-slate-700/80 bg-night-soft p-2">
          <svg viewBox="0 0 100 100" className="w-full aspect-square max-h-80">
            {/* 坐标轴 */}
            <line x1="8" y1="88" x2="96" y2="88" stroke="#334155" strokeWidth="0.3" />
            <line x1="8" y1="12" x2="8" y2="88" stroke="#334155" strokeWidth="0.3" />
            <text x="52" y="97" textAnchor="middle" fontSize="3.5" fill="#64748b">
              模型给正确答案的概率 p →
            </text>
            <text x="4" y="50" fontSize="3.5" fill="#64748b" transform="rotate(-90 4 50)" textAnchor="middle">
              损失 →
            </text>

            {/* loss = -ln(p) 曲线 */}
            <path d={curve} fill="none" stroke="#818cf8" strokeWidth="0.7" />

            {/* 当前点 */}
            <motion.circle
              animate={{ cx: px(p), cy: ly(loss) }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              r="1.8"
              fill={loss < 0.3 ? '#4ade80' : loss < 1.5 ? '#facc15' : '#f87171'}
              style={{ filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))' }}
            />
            <motion.line
              animate={{ x1: px(p), x2: px(p), y1: ly(loss), y2: 88 }}
              stroke="#475569"
              strokeWidth="0.25"
              strokeDasharray="1 1"
            />
          </svg>
        </div>

        {/* 读数 */}
        <div className="md:w-52 space-y-4">
          <div className="rounded-xl border border-slate-700/80 bg-night-soft p-4">
            <p className="font-mono text-[10px] text-slate-500">正确答案的概率 p</p>
            <p className="font-mono text-3xl font-bold text-cyan-300">{(p * 100).toFixed(0)}%</p>
          </div>
          <div className="rounded-xl border border-slate-700/80 bg-night-soft p-4">
            <p className="font-mono text-[10px] text-slate-500">损失 loss = −ln(p)</p>
            <motion.p
              key={loss.toFixed(2)}
              className={`font-mono text-3xl font-bold ${
                loss < 0.3 ? 'text-emerald-400' : loss < 1.5 ? 'text-yellow-400' : 'text-red-400'
              }`}
            >
              {loss.toFixed(2)}
            </motion.p>
          </div>
          <p className="text-xs text-slate-500 leading-5">
            {loss < 0.3
              ? '✅ 很有把握，几乎不用调整'
              : loss < 1.5
                ? '⚠️ 半信半疑，还有进步空间'
                : '❌ 错得离谱 —— 损失很大，需要大幅调整参数'}
          </p>
        </div>
      </div>

      <input
        type="range"
        min="0.02"
        max="0.99"
        step="0.01"
        value={p}
        onChange={(e) => setP(Number(e.target.value))}
        className="w-full mt-6 accent-indigo-500"
      />
    </div>
  )
}
