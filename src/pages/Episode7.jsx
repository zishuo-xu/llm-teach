import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import Section from '../components/Section'
import Footer from '../components/Footer'
import PipelineDemo from '../components/PipelineDemo'
import LayerStackDemo from '../components/LayerStackDemo'
import ResidualDiagram from '../components/ResidualDiagram'

export const EP7_SECTIONS = [
  { href: '#pipeline', label: '全景流水线' },
  { href: '#stack', label: '层叠的规模' },
  { href: '#residual', label: '残差连接' },
  { href: '#recap', label: '全系列回顾' },
]

const RECAP = [
  { no: '01', to: '/episode/1', title: '推理过程', point: 'Token 一个个蹦出来，KV Cache 省掉重复计算' },
  { no: '02', to: '/episode/2', title: '温度与采样', point: '概率分布怎么变成具体的词' },
  { no: '03', to: '/episode/3', title: '注意力机制', point: '每个词决定该关注谁' },
  { no: '04', to: '/episode/4', title: '幻觉', point: '通顺 ≠ 真实，RAG 给模型开小抄' },
  { no: '05', to: '/episode/5', title: 'Embedding', point: '词变成语义空间里的坐标' },
  { no: '06', to: '/episode/6', title: '训练', point: '预测-损失-下降，万亿次循环练出一切' },
]

export default function Episode7() {
  return (
    <>
      <Hero
        kicker="第二季 · 第三期 · THE FULL PICTURE"
        title="Transformer 全景图"
        subtitle="前六期的每个零件，你都已经亲手玩过了。这一期没有新知识 —— 我们把它们全部拼起来。"
        ctaHref="#pipeline"
      />

      <Section
        id="pipeline"
        index="§1 · THE PIPELINE"
        title="一次生成，走完所有零件"
        stage={<PipelineDemo />}
        wide
      >
        <p>
          从你按下回车，到第一个词出现，数据流经六个环节。
          点击播放，看脉冲依次点亮它们；点击任意环节，可以跳回对应的那一期复习。
        </p>
      </Section>

      <Section
        id="stack"
        index="§2 · THE STACK"
        title="同一个零件，叠 96 次"
        stage={<LayerStackDemo />}
        wide
      >
        <p>
          全景图里的「Transformer 层 ×96」不是修辞 —— 真实的模型就是把同一个模块
          原样叠上几十上百次。切换模型，看看规模差距。
        </p>
      </Section>

      <Section
        id="residual"
        index="§3 · THE GLUE"
        title="还有一个幕后功臣：残差连接"
        stage={<ResidualDiagram />}
      >
        <p>
          96 层叠起来，第六期的梯度下降还传得回去吗？靠的是每层都配一条
          <b className="text-slate-200">旁路高速公路</b>：
        </p>
      </Section>

      <Section
        id="recap"
        index="§4 · RECAP"
        title="你已经拼完了整张图"
        stage={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECAP.map((r, i) => (
              <Link key={r.no} to={r.to}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group h-full rounded-xl border border-slate-700/80 bg-night-soft p-5 hover:border-cyan-400/40 transition-colors"
                >
                  <p className="font-mono text-2xl font-bold bg-gradient-to-br from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    {r.no}
                  </p>
                  <h3 className="mt-1.5 font-bold text-slate-100 group-hover:text-cyan-200 transition-colors">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400 leading-6">{r.point}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        }
        wide
      >
        <p>
          七期内容，从一句话的输入，到万亿参数的训练 —— 
          现在再看到「Transformer 架构图」，里面的每个方块你都认识。🎉
        </p>
      </Section>

      <Footer
        kicker="SEASON 3 · EPISODE 1"
        title="第八期 · 对齐与 RLHF"
        desc="预训练模型只会续写，是谁教它「回答问题」的？"
        to="/episode/8"
      />
    </>
  )
}
