import Hero from '../components/Hero'
import Section from '../components/Section'
import Footer from '../components/Footer'
import AlignmentToggleDemo from '../components/AlignmentToggleDemo'
import PreferenceGame from '../components/PreferenceGame'
import RLHFFlowDemo from '../components/RLHFFlowDemo'
import RewardHackingDemo from '../components/RewardHackingDemo'

export const EP8_SECTIONS = [
  { href: '#gap', label: '差距在哪' },
  { href: '#game', label: '你当标注员' },
  { href: '#rlhf', label: 'RLHF 三步' },
  { href: '#hacking', label: '奖励黑客' },
]

export default function Episode8() {
  return (
    <>
      <Hero
        kicker="第三季 · 第一期 · ALIGNMENT"
        title="模型怎么从「会说话」到「懂规矩」？"
        subtitle="第六期讲的预训练，只教会了模型续写。但你问它问题时它不会胡言乱语 —— 这中间差的一步，叫对齐。"
        ctaHref="#gap"
      />

      <Section
        id="gap"
        index="§1 · THE GAP"
        title="预训练模型其实不会「回答问题」"
        stage={<AlignmentToggleDemo />}
        wide
      >
        <p>
          预训练的目标只有一个：预测下一个 Token（第一、六期）。
          所以对它来说，你的提问不是"问题"，而是一段<b className="text-slate-200">待续写的开头</b>。
        </p>
        <p>
          拨动开关对比：从"续写帖子"到"认真作答"，中间发生的就是
          <b className="text-slate-200">对齐（Alignment）</b>。
        </p>
      </Section>

      <Section
        id="game"
        index="§2 · YOUR TURN"
        title="对齐的原料：先来当一回标注员"
        stage={<PreferenceGame />}
        wide
      >
        <p>
          对齐不是靠写规则教出来的，而是靠海量<b className="text-slate-200">「哪个回答更好」的人类判断</b>。
          在讲原理之前，先亲身体验一下这份生产对齐原料的工作 —— 三题，认真选。
        </p>
      </Section>

      <Section
        id="rlhf"
        index="§3 · RLHF"
        title="三步走：SFT → 奖励模型 → PPO"
        stage={<RLHFFlowDemo />}
        wide
      >
        <p>
          你刚才做的二选一，就是整个流程的核心燃料。
          完整的 <b className="text-slate-200">RLHF（基于人类反馈的强化学习）</b>分三步，
          点击逐步浏览：
        </p>
      </Section>

      <Section
        id="hacking"
        index="§4 · REWARD HACKING"
        title="小心：裁判也会被「骗」"
        stage={<RewardHackingDemo />}
        wide
      >
        <p>
          PPO 优化的是"裁判给的分"，不是"真正的好"。
          如果裁判有偏见（比如偏爱长回答），模型就会<b className="text-slate-200">钻裁判的空子</b> ——
          点击播放，看一场真实的"指标满分、质量崩盘"。
        </p>
        <p>
          这就是为什么对齐至今仍是开放问题：第四期的幻觉、网络上的"AI 味"套话，
          很多都能追溯到这一步。
        </p>
      </Section>

      <Footer
        kicker="NEXT EPISODE"
        title="第九期 · 多模态"
        desc="把图片切成 patch 当 Token —— 模型是如何学会「看」的？"
      />
    </>
  )
}
