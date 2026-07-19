import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlayback } from '../hooks/usePlayback'
import PlaybackControls from './PlaybackControls'

const STAGES = [
  {
    icon: '✂️',
    name: '分词',
    ep: '第一期',
    epPath: '/episode/1',
    summary: '「大模型如何思考」被切成 4 个 Token，每个对应词表里的一个 id。',
  },
  {
    icon: '🔢',
    name: 'Embedding',
    ep: '第五期',
    epPath: '/episode/5',
    summary: '每个 id 查表变成向量 —— 词从符号变成语义空间里的坐标。',
  },
  {
    icon: '🕸️',
    name: 'Transformer 层 ×96',
    ep: '第三期 + 第一期',
    epPath: '/episode/3',
    summary:
      '每层里：注意力让词互相「看」（Q/K/V 匹配，KV Cache 避免重算），前馈网络做非线性变换。同样的层叠 96 次，表示越来越抽象。',
  },
  {
    icon: '📊',
    name: '输出概率分布',
    ep: '第二期',
    epPath: '/episode/2',
    summary: '最后一个位置的向量被投影回词表，softmax 得到下一个 Token 的概率分布。',
  },
  {
    icon: '🎲',
    name: '采样选词',
    ep: '第二期',
    epPath: '/episode/2',
    summary: '按温度/Top-p 从分布里掷骰子，选出下一个 Token（也可能跑调成幻觉，见第四期）。',
  },
  {
    icon: '↺',
    name: '接回输入，再来一遍',
    ep: '第一期',
    epPath: '/episode/1',
    summary: '新 Token 追加到上下文末尾，回到第①步 —— 自回归循环，直到生成结束。',
  },
]

/** Transformer 全景流水线：播放时数据脉冲依次点亮每个环节 */
export default function PipelineDemo() {
  const { step, playing, speed, toggle, next, reset, setSpeed } = usePlayback(
    STAGES.length - 1,
    { interval: 1800 }
  )
  const [selected, setSelected] = useState(null)
  const active = selected ?? step

  return (
    <div>
      {/* 流水线 */}
      <div className="flex flex-col md:flex-row md:items-stretch gap-2">
        {STAGES.map((s, i) => {
          const isActive = i === active
          const passed = i < active
          return (
            <div key={s.name} className="flex md:flex-col items-center gap-2 flex-1">
              <button
                onClick={() => setSelected(isActive && selected !== null ? null : i)}
                className={`relative w-full rounded-xl border p-3 text-left transition-all ${
                  isActive
                    ? 'border-cyan-400/70 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                    : passed
                      ? 'border-indigo-500/40 bg-indigo-500/5'
                      : 'border-slate-700 bg-night-soft'
                }`}
              >
                <p className="text-xl">{s.icon}</p>
                <p className={`mt-1 text-sm font-bold ${isActive ? 'text-cyan-200' : 'text-slate-200'}`}>
                  {s.name}
                </p>
                <p className="font-mono text-[9px] text-indigo-400/80 mt-0.5">回扣{ s.ep }</p>
                {isActive && (
                  <motion.span
                    layoutId="pulse"
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </button>
              {i < STAGES.length - 1 && (
                <span className={`text-lg shrink-0 md:rotate-0 rotate-90 ${passed || isActive ? 'text-cyan-400' : 'text-slate-700'}`}>
                  ➜
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* 详情卡 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-5 rounded-xl border border-slate-700/80 bg-night-soft p-5"
        >
          <p className="text-sm text-slate-300 leading-7">
            <b className="text-slate-100">
              {STAGES[active].icon} {STAGES[active].name}
            </b>
            ：{STAGES[active].summary}
          </p>
          <Link
            to={STAGES[active].epPath}
            className="inline-block mt-2 font-mono text-xs text-cyan-300 hover:text-cyan-200"
          >
            复习{STAGES[active].ep} →
          </Link>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center mt-4">
        <PlaybackControls
          playing={playing}
          speed={speed}
          onToggle={() => {
            setSelected(null)
            toggle()
          }}
          onNext={() => {
            setSelected(null)
            next()
          }}
          onReset={() => {
            setSelected(null)
            reset()
          }}
          onSpeed={setSpeed}
        />
      </div>
    </div>
  )
}
