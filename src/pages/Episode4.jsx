import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import Section from '../components/Section'
import Footer from '../components/Footer'
import HallucinationExample from '../components/HallucinationExample'
import DriftDemo from '../components/DriftDemo'
import RAGDemo from '../components/RAGDemo'

export const EP4_SECTIONS = [
  { href: '#scene', label: '翻车现场' },
  { href: '#roots', label: '幻觉的根源' },
  { href: '#drift', label: '采样漂移' },
  { href: '#rag', label: '怎么治' },
]

const ROOTS = [
  {
    icon: '🔁',
    title: '它只会「续写」，不会「核实」',
    desc: '第一期的自回归告诉我们：模型的唯一目标是让下一个 Token「听起来合理」。通顺 ≠ 真实，编造的续集和真实的书名，在概率上可能一样顺。',
    episode: '回扣第一期 · 自回归',
  },
  {
    icon: '📚',
    title: '训练数据有盲区，也有错误',
    desc: '模型知道的都来自训练文本。没见过的（如新产品内部资料）、记错的（似曾相似的细节），它都会用「最像」的内容补上。',
    episode: '数据的边界',
  },
  {
    icon: '🎲',
    title: '采样给幻觉开了门',
    desc: '第二期的温度与 Top-p：温度越高，长尾里的错误答案越容易被掷中。创造力和幻觉，本质是同源的随机性。',
    episode: '回扣第二期 · 温度与采样',
  },
]

export default function Episode4() {
  return (
    <>
      <Hero
        kicker="第四期 · 幻觉"
        title="模型为什么一本正经地胡说八道？"
        subtitle="它能写诗、能编程，却会面不改色地编造根本不存在的书 —— 这不是 bug，是它在「本职工作上」太出色了。"
        ctaHref="#scene"
      />

      <Section
        id="scene"
        index="§1 · THE SCENE"
        title="先看一个翻车现场"
        stage={<HallucinationExample />}
      >
        <p>
          注意这个提问里埋了陷阱：<b className="text-slate-200">《蛙》根本没有续集</b>。
          但模型很少纠正前提 —— 它顺着你的假设，流畅地编了下去。点击播放，看它表演。
        </p>
      </Section>

      <Section
        id="roots"
        index="§2 · ROOT CAUSES"
        title="幻觉不是偶然，是三个根源的合力"
        stage={
          <div className="grid md:grid-cols-3 gap-4">
            {ROOTS.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-xl border border-slate-700/80 bg-night-soft p-5"
              >
                <p className="text-2xl mb-2">{r.icon}</p>
                <h3 className="font-bold text-slate-100 mb-2">{r.title}</h3>
                <p className="text-sm text-slate-400 leading-6">{r.desc}</p>
                <p className="mt-3 font-mono text-[10px] text-indigo-400/80">{r.episode}</p>
              </motion.div>
            ))}
          </div>
        }
        wide
      >
        <p>
          把前三期的知识串起来，幻觉几乎是<b className="text-slate-200">必然产物</b>：
        </p>
      </Section>

      <Section
        id="drift"
        index="§3 · SAMPLING DRIFT"
        title="连「知道」的知识，也会跑丢"
        stage={<DriftDemo />}
        wide
      >
        <p>
          即使模型对正确答案给出了很高概率，<b className="text-slate-200">只要采样就有跑丢的可能</b>。
          下面这个问题模型"基本知道"答案，但连续问 30 次试试 —— 尤其把温度调高以后。
        </p>
        <p>
          这就是为什么重要的回答要<b className="text-slate-200">降低温度</b>，
          也解释了为什么你有时会觉得 AI「上次还答对，这次就瞎说」。
        </p>
      </Section>

      <Section
        id="rag"
        index="§4 · THE FIX"
        title="怎么治：别让它裸考，给它小抄"
        stage={<RAGDemo />}
        wide
      >
        <p>
          最实用的方案是 <b className="text-slate-200">RAG（检索增强生成）</b>：
          回答前先去资料库里检索相关内容，把资料塞进上下文，让模型<b className="text-slate-200">开卷考试</b>。
        </p>
        <p>
          拨动开关对比：同一个问题，仅凭记忆时满嘴跑火车；
          接入检索后，回答有了出处，没提到的信息会明说「资料未提及」。
          配合低温采样和来源引用，就是现代 AI 产品的标配三件套。
        </p>
      </Section>

      <Footer
        kicker="SEASON 2 · EPISODE 1"
        title="第五期 · Embedding 语义空间"
        desc="第一季讲完了推理链路。第二季打开黑箱 —— 先看看词是怎么变成数字的"
        to="/episode/5"
      />
    </>
  )
}
