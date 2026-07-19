import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'

const SEASONS = [
  {
    id: 'SEASON 1',
    title: '推理与生成',
    desc: '从你敲下一句话，到模型一个字一个字地回答 —— 这条链路上发生了什么。',
    accent: 'from-indigo-400 to-cyan-400',
    episodes: [
      {
        no: '01',
        to: '/episode/1',
        title: '推理过程可视化',
        desc: 'Token 是怎么一个一个蹦出来的？为什么需要 KV Cache？',
        tags: ['Tokenize', '自回归', 'KV Cache'],
        status: '已上线',
      },
      {
        no: '02',
        to: '/episode/2',
        title: '温度与采样',
        desc: 'Temperature、Top-p 如何影响输出的创造力和稳定性。',
        tags: ['Softmax', 'Temperature', 'Top-p'],
        status: '已上线',
      },
      {
        no: '03',
        to: '/episode/3',
        title: '注意力机制',
        desc: 'Q/K/V 的真面目、注意力射线与多头协作。',
        tags: ['Q/K/V', '注意力矩阵', 'Multi-Head'],
        status: '已上线',
      },
      {
        no: '04',
        to: '/episode/4',
        title: '幻觉',
        desc: '模型为什么一本正经地胡说八道？根源与 RAG 解药。',
        tags: ['错误前提', '采样漂移', 'RAG'],
        status: '已上线',
      },
    ],
  },
  {
    id: 'SEASON 2',
    title: '模型的内部世界',
    desc: '打开黑箱：词如何变成数字、知识如何存进参数、模型又是如何被训练出来的。',
    accent: 'from-violet-400 to-fuchsia-400',
    episodes: [
      {
        no: '05',
        to: '/episode/5',
        title: 'Embedding 语义空间',
        desc: '词是怎么变成数字的？语义地图、近义词聚类与「国王-男人+女人≈女王」。',
        tags: ['词向量', '语义地图', '向量算术'],
        status: '已上线',
      },
      {
        no: '06',
        to: '/episode/6',
        title: '训练是怎么进行的',
        desc: '预测-损失-下降的训练循环：参数是怎么被一步步调到位的。',
        tags: ['损失函数', '梯度下降', '学习率'],
        status: '已上线',
      },
      {
        no: '07',
        to: '/episode/7',
        title: 'Transformer 全景图',
        desc: '把前六期拼成一张完整架构图：数据从输入到输出，流经每个你认识的零件。',
        tags: ['流水线', '层叠', '残差连接'],
        status: '已上线',
      },
    ],
  },
  {
    id: 'SEASON 3',
    title: '模型与人类社会',
    desc: '会算、会看、会守规矩 —— 模型如何对齐人类偏好，又如何走出纯文本的世界。',
    accent: 'from-emerald-400 to-teal-400',
    episodes: [
      {
        no: '08',
        to: '/episode/8',
        title: '对齐与 RLHF',
        desc: '预训练模型只会续写，是谁教它「回答问题」的？人类偏好、奖励模型与奖励黑客。',
        tags: ['SFT', '奖励模型', 'PPO', '奖励黑客'],
        status: '已上线',
      },
      {
        no: '09',
        to: null,
        title: '多模态',
        desc: '把图片切成 patch 当 Token —— 模型如何学会「看」？筹备中。',
        tags: [],
        status: '筹备中',
      },
    ],
  },
]

function EpisodeCard({ ep, delay }) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
      className={`group h-full rounded-2xl border p-6 transition-all ${
        ep.to
          ? 'border-slate-800 bg-night-card/80 hover:border-indigo-400/50 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]'
          : 'border-slate-800/50 bg-night-card/40 opacity-50'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-3xl font-bold bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          {ep.no}
        </p>
        <span
          className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-mono ${
            ep.status === '已上线'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-800 text-slate-500 border border-slate-700'
          }`}
        >
          {ep.status}
        </span>
      </div>
      <h3 className="mt-2 text-xl font-bold text-slate-100 group-hover:text-cyan-200 transition-colors">
        {ep.title}
      </h3>
      <p className="mt-1.5 text-sm text-slate-400 leading-6">{ep.desc}</p>
      {ep.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {ep.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-full text-[11px] font-mono border border-slate-700 text-slate-400"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
  return ep.to ? <Link to={ep.to}>{inner}</Link> : <div>{inner}</div>
}

export default function Home() {
  return (
    <>
      <Hero
        kicker="LLM · VISUALIZED"
        title="看懂大模型"
        subtitle="一套滚动叙事 + 交互动画的大模型可视化教程，每期讲透一个主题。"
        ctaLabel="浏览课程 ↓"
        ctaHref="#episodes"
      />

      <main id="episodes" className="max-w-5xl mx-auto px-6 pb-32 -mt-16 relative space-y-20">
        {SEASONS.map((season) => (
          <div key={season.id}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <p className={`font-mono text-sm tracking-widest bg-gradient-to-r ${season.accent} bg-clip-text text-transparent`}>
                {season.id}
              </p>
              <h2 className="mt-1 text-3xl font-bold text-slate-100">{season.title}</h2>
              <p className="mt-2 text-slate-500">{season.desc}</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-5">
              {season.episodes.map((ep, i) => (
                <EpisodeCard key={ep.no} ep={ep} delay={i * 0.06} />
              ))}
            </div>
          </div>
        ))}
      </main>
    </>
  )
}
