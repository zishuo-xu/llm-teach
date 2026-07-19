import Hero from '../components/Hero'
import Section from '../components/Section'
import Footer from '../components/Footer'
import TokenizeDemo from '../components/TokenizeDemo'
import AutoregressiveDemo from '../components/AutoregressiveDemo'
import NoCacheDemo from '../components/NoCacheDemo'
import KVCacheDemo from '../components/KVCacheDemo'

export const EP1_SECTIONS = [
  { href: '#tokenize', label: '分词' },
  { href: '#autoregressive', label: '自回归' },
  { href: '#why-cache', label: '为何缓存' },
  { href: '#kv-cache', label: 'KV Cache' },
]

export default function Episode1() {
  return (
    <>
      <Hero
        kicker="第一期 · 推理过程可视化"
        title="大模型是如何思考的？"
        subtitle="从一句话输入，到一个一个 Token 蹦出来 —— 滚动页面，亲眼看见推理的每一步。"
        ctaHref="#tokenize"
      />

      <Section
        id="tokenize"
        index="§1 · TOKENIZE"
        title="输入先被切成一个个 Token"
        stage={<TokenizeDemo />}
      >
        <p>
          模型并不直接"读字"。你输入的每句话，都会先被<b className="text-slate-200">分词器</b>
          拆成一串 Token —— 它可能是一个字、一个词，甚至是半个词。
        </p>
        <p>
          每个 Token 对应词表里的一个数字 id，模型真正看到的，其实是一串数字。点击播放，看句子如何"裂开"。
        </p>
      </Section>

      <Section
        id="autoregressive"
        index="§2 · AUTOREGRESSIVE"
        title="然后一个一个「想」出下一个 Token"
        stage={<AutoregressiveDemo />}
        wide
      >
        <p>
          模型做的事只有一件：给定前面所有 Token，<b className="text-slate-200">预测下一个 Token 的概率分布</b>，
          从中选出一个，接在末尾 —— 然后再预测下一个。
        </p>
        <p>
          这种"输出接回输入"的循环叫做<b className="text-slate-200">自回归生成</b>。
          你看到的流畅回答，就是这样一个 Token 一个 Token 蹦出来的。
        </p>
      </Section>

      <Section
        id="why-cache"
        index="§3 · WHY CACHE"
        title="但这里藏着巨大的浪费"
        stage={<NoCacheDemo />}
        wide
      >
        <p>
          每预测一个新 Token，模型都要做一次注意力计算：让每个 Token 去"看"前面所有的 Token。
        </p>
        <p>
          问题是 —— 如果不加优化，每生成一个 Token，模型会把<b className="text-slate-200">整段前文重新算一遍</b>。
          点击播放，看红色格子的浪费有多惊人。
        </p>
      </Section>

      <Section
        id="kv-cache"
        index="§4 · KV CACHE"
        title="KV Cache：把算过的东西存起来"
        stage={<KVCacheDemo />}
        wide
      >
        <p>
          关键观察：历史 Token 算出的 K、V 向量，<b className="text-slate-200">每一步都一模一样</b>。
          既然不变，何必重算？
        </p>
        <p>
          <b className="text-slate-200">KV Cache</b> 把每个历史 Token 的 K、V 向量存进显存，
          之后每步只需为<b className="text-slate-200">新 Token 算一行</b>注意力，再和缓存拼起来。
          代价是显存占用 —— 这正是"用空间换时间"的经典案例。
        </p>
      </Section>

      <Footer
        kicker="NEXT EPISODE"
        title="第二期 · 温度与采样"
        desc="模型下一步怎么「选词」？—— Temperature、Top-p 与那些「幻觉」的来历"
        to="/episode/2"
      />
    </>
  )
}
