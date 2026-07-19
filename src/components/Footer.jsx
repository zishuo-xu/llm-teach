import { Link } from 'react-router-dom'

/**
 * @param {string} kicker 小标题
 * @param {string} title 预告标题
 * @param {string} desc 预告描述
 * @param {string} [to] 下一期路由（可选，有才显示链接）
 */
export default function Footer({ kicker, title, desc, to }) {
  return (
    <footer className="border-t border-slate-800/60 py-16 px-6 text-center">
      <p className="font-mono text-sm text-slate-500 tracking-widest mb-3">{kicker}</p>
      <h3 className="text-2xl font-bold text-slate-200 mb-2">{title}</h3>
      <p className="text-slate-500">{desc}</p>
      {to && (
        <Link
          to={to}
          className="inline-block mt-6 px-6 py-2.5 rounded-full border border-indigo-400/50 text-indigo-300 hover:bg-indigo-500/10 transition-colors"
        >
          前往下一期 →
        </Link>
      )}
      <p className="mt-10 text-xs text-slate-600 font-mono">
        <Link to="/" className="hover:text-slate-400 transition-colors">llm-teach</Link> · 大模型可视化教程
      </p>
    </footer>
  )
}
