import { motion } from 'framer-motion'
import { tokenColor } from '../data/tokens'

/** 单个彩色 Token 块，可附带 id 角标 */
export function TokenChip({ text, index, id, highlight = false, size = 'md' }) {
  const color = tokenColor(index)
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1.5 text-base',
    lg: 'px-4 py-2 text-lg',
  }
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.6, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
      className={`relative inline-flex flex-col items-center rounded-lg font-mono font-semibold ${sizes[size]}`}
      style={{
        color,
        backgroundColor: `${color}1a`,
        border: `1px solid ${color}66`,
        boxShadow: highlight ? `0 0 16px ${color}88` : `0 0 6px ${color}33`,
      }}
    >
      {text}
      {id !== undefined && (
        <span className="text-[9px] font-normal opacity-60 leading-none mt-0.5">{id}</span>
      )}
    </motion.span>
  )
}

/** 一排 Token 块 */
export default function TokenChips({ tokens, showIds = false, offset = 0, size = 'md' }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tokens.map((t, i) => (
        <TokenChip
          key={`${i}-${t.text ?? t}`}
          text={t.text ?? t}
          index={offset + i}
          id={showIds ? t.id : undefined}
          size={size}
        />
      ))}
    </div>
  )
}
