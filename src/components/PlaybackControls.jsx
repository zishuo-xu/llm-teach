const SPEEDS = [0.5, 1, 2]

export default function PlaybackControls({ playing, speed, onToggle, onNext, onReset, onSpeed }) {
  const btn =
    'px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-800/80 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:border-slate-500 transition-colors'

  return (
    <div className="flex items-center gap-2">
      <button className={btn} onClick={onToggle}>
        {playing ? '⏸ 暂停' : '▶ 播放'}
      </button>
      <button className={btn} onClick={onNext}>
        ⏭ 单步
      </button>
      <button className={btn} onClick={onReset}>
        ↺ 重置
      </button>
      <div className="flex rounded-lg overflow-hidden border border-slate-700">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeed(s)}
            className={`px-2.5 py-1.5 text-xs font-mono transition-colors ${
              speed === s
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  )
}
