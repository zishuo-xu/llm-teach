import Hero from '../components/Hero'
import Section from '../components/Section'
import Footer from '../components/Footer'
import EmbeddingLookup from '../components/EmbeddingLookup'
import SemanticMap from '../components/SemanticMap'
import VectorArithmetic from '../components/VectorArithmetic'

export const EP5_SECTIONS = [
  { href: '#lookup', label: '查表' },
  { href: '#map', label: '语义地图' },
  { href: '#arithmetic', label: '向量算术' },
]

export default function Episode5() {
  return (
    <>
      <Hero
        kicker="第二季 · 第一期 · EMBEDDING"
        title="词是怎么变成数字的？"
        subtitle="第一期说过 Token 会变成 id —— 但那只是个编号。真正让模型「理解」词义的，是 id 背后的那串向量。"
        ctaHref="#lookup"
      />

      <Section
        id="lookup"
        index="§1 · LOOKUP"
        title="Embedding 表：每个 id 对应一行向量"
        stage={<EmbeddingLookup />}
        wide
      >
        <p>
          还记得第一期的分词吗？「猫」被切成 Token 后得到 id <b className="text-slate-200">8823</b>。
          接下来模型会拿着这个 id 去一张巨大的表里查出一行数字 —— 这就是
          <b className="text-slate-200">Embedding 向量</b>。
        </p>
        <p>
          这串数字不是随便填的：<b className="text-slate-200">它是词义的坐标</b>。
          从这一步起，「猫」不再是一个符号，而是空间里的一个点。
        </p>
      </Section>

      <Section
        id="map"
        index="§2 · SEMANTIC MAP"
        title="语义地图：意思近的词住得也近"
        stage={<SemanticMap />}
        wide
      >
        <p>
          把每个词的向量投影到平面上，神奇的事情发生了：
          动物挤成一团，水果聚在一堆，科技词另立门户 ——
          <b className="text-slate-200">距离近 = 意思近</b>。
        </p>
        <p>
          这些位置不是人工安排的，而是模型训练时「住出来的」：
          出现在相似上下文里的词，向量会被推得越来越近。（怎么推的？第六期讲。）
        </p>
      </Section>

      <Section
        id="arithmetic"
        index="§3 · VECTOR ARITHMETIC"
        title="最神奇的一幕：向量可以做算术"
        stage={<VectorArithmetic />}
        wide
      >
        <p>
          如果词义真是坐标，那坐标加减应该也有意义。还真有 ——
          经典的 <b className="text-slate-200">国王 − 男人 + 女人 ≈ 女王</b>：
          从「国王」出发，减去「男性」的方向，加上「女性」的方向，
          落点最近的那个词，就是「女王」。
        </p>
        <p>
          这说明向量里存的不只是「这个词是什么」，
          还有<b className="text-slate-200">词与词之间的方向关系</b>：性别、单复数、国家与首都……
          点击播放，跟着箭头走一遍。
        </p>
      </Section>

      <Footer
        kicker="NEXT EPISODE"
        title="第六期 · 训练是怎么进行的"
        desc="这些向量是被什么力量「推」到正确位置上的？—— 损失函数与梯度下降的直觉"
        to="/episode/6"
      />
    </>
  )
}
