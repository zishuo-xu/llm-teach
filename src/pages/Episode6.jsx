import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import Section from '../components/Section'
import Footer from '../components/Footer'
import LossDemo from '../components/LossDemo'
import GradientDescentDemo from '../components/GradientDescentDemo'
import EmbeddingEvolutionDemo from '../components/EmbeddingEvolutionDemo'

export const EP6_SECTIONS = [
  { href: '#loop', label: '训练循环' },
  { href: '#loss', label: '损失函数' },
  { href: '#descent', label: '梯度下降' },
  { href: '#evolution', label: '向量的成长' },
]

const LOOP_STEPS = [
  { icon: '🔮', title: '① 预测', desc: '给一段上文，模型预测下一个 Token（就是第一期讲的推理）' },
  { icon: '⚖️', title: '② 算损失', desc: '和标准答案对比：错得越离谱，损失越大' },
  { icon: '🧭', title: '③ 找方向', desc: '反向传播算出每个参数该往哪边调（梯度）' },
  { icon: '🔧', title: '④ 调参数', desc: '所有参数往损失更小的方向挪一小步' },
]

export default function Episode6() {
  return (
    <>
      <Hero
        kicker="第二季 · 第二期 · TRAINING"
        title="模型是怎么「学」出来的？"
        subtitle="前五期看到的每个行为 —— 词义、注意力、概率分布 —— 都不是人写的规则，而是被一个简单循环「练」出来的。"
        ctaHref="#loop"
      />

      <Section
        id="loop"
        index="§1 · THE LOOP"
        title="训练 ≠ 推理：一个用，一个练"
        stage={
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LOOP_STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative rounded-xl border border-slate-700/80 bg-night-soft p-5"
              >
                <p className="text-2xl mb-2">{s.icon}</p>
                <h3 className="font-bold text-slate-100 mb-1.5">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-6">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        }
        wide
      >
        <p>
          第一季讲的<b className="text-slate-200">推理</b>，是用一套<b className="text-slate-200">固定的参数</b>做预测；
          而<b className="text-slate-200">训练</b>，就是不断调整这些参数的过程。
          循环只有四步，但重复几万亿次：
        </p>
        <p>
          关键在 ③④：怎么知道"往哪边调"？调多少？—— 这就是接下来两节的主角。
        </p>
      </Section>

      <Section
        id="loss"
        index="§2 · LOSS FUNCTION"
        title="损失函数：给「错得多离谱」打分"
        stage={<LossDemo />}
        wide
      >
        <p>
          模型输出的是概率分布。如果正确答案的概率是 99%，说明学得好；
          如果只有 5%，就错得离谱。<b className="text-slate-200">损失函数</b>把这个差距变成一个数字：
          最常用的 <b className="text-slate-200">loss = −ln(p)</b> ——
          概率越低，惩罚越狠，而且是指数级地狠。
        </p>
      </Section>

      <Section
        id="descent"
        index="§3 · GRADIENT DESCENT"
        title="梯度下降：蒙着眼睛下山"
        stage={<GradientDescentDemo />}
        wide
      >
        <p>
          把损失想象成一座山谷，模型参数是小球的位置。
          每轮训练，小球看一眼脚下的坡度（<b className="text-slate-200">梯度</b>），
          就往更低处挪一步 —— 这就是<b className="text-slate-200">梯度下降</b>。
        </p>
        <p>
          每步挪多大，由<b className="text-slate-200">学习率</b>决定。
          切换三种学习率播放，看看"步子大小"有多讲究。
        </p>
      </Section>

      <Section
        id="evolution"
        index="§4 · CLOSING THE LOOP"
        title="现在回答第五期的问题：向量是被谁推的？"
        stage={<EmbeddingEvolutionDemo />}
        wide
      >
        <p>
          第五期那张"意思近住得近"的语义地图，不是人设计的 ——
          就是这个预测-损失-下降的循环，在万亿次迭代里，
          把出现在相似上下文中的词<b className="text-slate-200">一点一点推到一起</b>。
        </p>
        <p>
          点击播放，亲眼看一遍词向量的"成长史"。
          至此，从分词到训练的核心链路你已经全部打通。🎉
        </p>
      </Section>

      <Footer
        kicker="NEXT EPISODE"
        title="第七期 · Transformer 全景图"
        desc="把前六期拼成一张完整架构图：数据从输入到输出，流经每一个你认识的零件"
        to="/episode/7"
      />
    </>
  )
}
