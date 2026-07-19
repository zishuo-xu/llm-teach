import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-7xl font-black bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold text-slate-100">这一页还没有被「生成」出来</h1>
      <p className="mt-2 text-slate-500">也许链接有误，也许这一期还在筹备中。</p>
      <Link
        to="/"
        className="mt-8 px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all"
      >
        返回课程目录
      </Link>
    </main>
  )
}
