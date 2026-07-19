/**
 * 注意力热力矩阵（共享组件）
 * @param {number[][]} matrix 行=query 列=key，null 表示被因果遮罩挡住
 * @param {string[]} tokens 轴标签
 * @param {'md'|'sm'} size
 * @param {[number,number]|null} selected 选中的 [query, key]
 * @param {(sel:[number,number]|null)=>void} onSelect
 */
export default function AttentionMatrix({ matrix, tokens, size = 'md', selected, onSelect }) {
  const n = tokens.length
  const cell = size === 'md' ? 'w-9 h-9 md:w-10 md:h-10' : 'w-5 h-5'

  return (
    <div className="inline-block">
      {/* 顶部 key 标签 */}
      <div className="flex" style={{ paddingLeft: size === 'md' ? 52 : 34 }}>
        {tokens.map((t) => (
          <div
            key={t}
            className={`${cell} flex items-end justify-center pb-0.5 font-mono ${
              size === 'md' ? 'text-[10px]' : 'text-[7px]'
            } text-slate-500`}
          >
            {t}
          </div>
        ))}
      </div>
      {matrix.map((row, r) => (
        <div key={r} className="flex items-center">
          <div
            className={`flex items-center justify-end pr-1.5 font-mono text-slate-500 ${
              size === 'md' ? 'w-[52px] text-[10px]' : 'w-[34px] text-[7px]'
            }`}
          >
            {tokens[r]}
          </div>
          {row.map((w, c) => {
            const masked = w === null
            const isSel = selected && selected[0] === r && selected[1] === c
            return (
              <button
                key={c}
                disabled={masked || !onSelect}
                onClick={() => onSelect?.(isSel ? null : [r, c])}
                className={`${cell} m-[1px] rounded-[4px] transition-transform ${
                  masked ? 'bg-slate-800/40' : 'hover:scale-110'
                } ${isSel ? 'ring-2 ring-white scale-110' : ''}`}
                style={
                  masked
                    ? undefined
                    : {
                        backgroundColor: `rgba(34,211,238,${0.08 + w * 0.92})`,
                        boxShadow: w > 0.5 ? `0 0 8px rgba(34,211,238,${w * 0.6})` : 'none',
                      }
                }
                title={masked ? '被因果遮罩挡住' : `${tokens[r]} → ${tokens[c]}：${(w * 100).toFixed(0)}%`}
              />
            )
          })}
        </div>
      ))}
      {size === 'md' && (
        <div className="mt-2 flex justify-between font-mono text-[9px] text-slate-600">
          <span>↑ 行：谁在提问（query）</span>
          <span>列：看向谁（key）↓</span>
        </div>
      )}
    </div>
  )
}
