import Hero from '../components/Hero'
import Section from '../components/Section'
import Footer from '../components/Footer'
import TemperatureDemo from '../components/TemperatureDemo'
import SamplingDemo from '../components/SamplingDemo'
import TopPDemo from '../components/TopPDemo'

export const EP2_SECTIONS = [
  { href: '#temperature', label: '温度' },
  { href: '#sampling', label: '采样 vs 贪婪' },
  { href: '#top-p', label: 'Top-p' },
]

export default function Episode2() {
  return (
    <>
      <Hero
        kicker="第二期 · 温度与采样"
        title="模型怎么「选词」？"
        subtitle="概率分布摆在面前，是每次都选最稳的那个，还是掷一把骰子？—— 这决定了 AI 是严谨还是天马行空。"
        ctaHref="#temperature"
      />

      <Section
        id="temperature"
        index="§1 · TEMPERATURE"
        title="温度：给概率分布「加热」或「冷却」"
        stage={<TemperatureDemo />}
        wide
      >
        <p>
          上一期说过，模型每步会输出下一个 Token 的<b className="text-slate-200">概率分布</b>。
          但在 softmax 之前，模型先给出的是一堆原始分数（logit）。
          把它们除以温度 T 再归一化，就能改变分布的「形状」。
        </p>
        <p>
          <b className="text-slate-200">T 越小，分布越尖锐</b>，高分词赢家通吃；
          <b className="text-slate-200">T 越大，分布越平坦</b>，低分词也能分到一杯羹。
          拖动滑块，亲眼看看分布如何变化。
        </p>
        <p className="text-xs text-slate-600">* 候选词与 logit 分数为教学示意数据。</p>
      </Section>

      <Section
        id="sampling"
        index="§2 · GREEDY vs SAMPLING"
        title="贪婪解码 vs 采样解码"
        stage={<SamplingDemo />}
        wide
      >
        <p>
          拿到分布后有两条路：<b className="text-slate-200">贪婪解码</b>永远选概率最高的词
          —— 稳定、可复现，但容易死板、爱复读；
          <b className="text-slate-200">采样解码</b>则按概率掷骰子，每次结果都可能不同。
        </p>
        <p>
          点击播放，看采样解码连续掷 60 次骰子：右侧直方图会告诉你，
          各词被选中的频率如何逐渐逼近它们的概率。
        </p>
      </Section>

      <Section
        id="top-p"
        index="§3 · TOP-P (NUCLEUS)"
        title="Top-p：只留靠谱的候选池"
        stage={<TopPDemo />}
        wide
      >
        <p>
          采样最大的风险是：分布尾部总有些离谱的词，概率再低，掷多了总会中。
          <b className="text-slate-200">Top-p（核采样）</b>的思路是：
          按概率从高到低累加，<b className="text-slate-200">刚好超过 p 就停</b>，
          只在这个「候选池」里重新归一化再采样。
        </p>
        <p>
          分布尖锐时池子自动变小（稳），分布平坦时池子自动变大（活）——
          这就是它比固定 Top-k 更聪明的地方。拖动滑块看池子如何伸缩。
        </p>
      </Section>

      <Footer
        kicker="NEXT EPISODE"
        title="第三期 · 注意力机制"
        desc="模型凭什么「理解」上下文？—— 每个词如何决定该关注谁"
        to="/episode/3"
      />
    </>
  )
}
