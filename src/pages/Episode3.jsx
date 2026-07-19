import Hero from '../components/Hero'
import Section from '../components/Section'
import Footer from '../components/Footer'
import QKVDiagram from '../components/QKVDiagram'
import AttentionRays from '../components/AttentionRays'
import AttentionMatrixDemo from '../components/AttentionMatrixDemo'
import MultiHeadDemo from '../components/MultiHeadDemo'

export const EP3_SECTIONS = [
  { href: '#qkv', label: 'Q/K/V' },
  { href: '#rays', label: '注意力射线' },
  { href: '#matrix', label: '注意力矩阵' },
  { href: '#multi-head', label: '多头' },
]

export default function Episode3() {
  return (
    <>
      <Hero
        kicker="第三期 · 注意力机制"
        title="模型凭什么「理解」上下文？"
        subtitle="还记得第一期缓存的 K、V 吗？这一期揭开它们的真面目 —— 每个词如何决定「该关注谁」。"
        ctaHref="#qkv"
      />

      <Section
        id="qkv"
        index="§1 · QUERY / KEY / VALUE"
        title="每个词都扮演三种角色"
        stage={<QKVDiagram />}
        wide
      >
        <p>
          第一期我们说过：KV Cache 缓存的是每个 Token 的 K、V 向量。那它们到底是什么？
        </p>
        <p>
          每个 Token 的向量会被三个矩阵分别变换，得到三种身份：
          <b className="text-cyan-300">Q（提问）</b>、
          <b className="text-violet-300">K（标签）</b>、
          <b className="text-emerald-300">V（内容）</b>。
          一个词拿着自己的 Q 去和所有人的 K 做匹配，匹配度越高，就越"关注"对方的 V。
        </p>
      </Section>

      <Section
        id="rays"
        index="§2 · ATTENTION RAYS"
        title="注意力射线：谁在关注谁"
        stage={<AttentionRays />}
        wide
      >
        <p>
          「小猫追毛线球，因为<b className="text-slate-200">它</b>很好奇」——
          这里的「它」指谁？对人来说显而易见，对模型来说，要靠注意力算出来。
        </p>
        <p>
          点击下面任意一个词，看它的注意力射线：<b className="text-slate-200">线越粗，关注越多</b>。
          选中「它」，你会看到一条醒目的射线直指「小猫」。
        </p>
      </Section>

      <Section
        id="matrix"
        index="§3 · ATTENTION MATRIX"
        title="把整句话的注意力画成矩阵"
        stage={<AttentionMatrixDemo />}
        wide
      >
        <p>
          把所有词两两之间的注意力权重排成一张表，就是<b className="text-slate-200">注意力矩阵</b>
          —— 颜色越亮，关注越多。点击格子可以看具体数值。
        </p>
        <p>
          注意右上角的灰色区域：那是<b className="text-slate-200">因果遮罩</b>，
          每个词不能偷看未来。这个约束，正是第一期 KV Cache 能够成立的根基。
        </p>
      </Section>

      <Section
        id="multi-head"
        index="§4 · MULTI-HEAD"
        title="一个头不够，那就来一打"
        stage={<MultiHeadDemo />}
        wide
      >
        <p>
          一句话里的"关系"不止一种：指代、位置、语法……
          单个注意力头很难面面俱到，于是模型同时运行<b className="text-slate-200">多个头</b>，
          让每个头专注于一种模式。
        </p>
      </Section>

      <Footer
        kicker="NEXT EPISODE"
        title="第四期 · 幻觉"
        desc="懂得了生成与采样，就不难理解：模型为什么会一本正经地胡说八道？"
        to="/episode/4"
      />
    </>
  )
}
