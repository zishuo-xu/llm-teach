// 期数配置：新增一期只需在这里加一条（路由、导航锚点、顶部导航自动生效）

import Episode1, { EP1_SECTIONS } from './pages/Episode1'
import Episode2, { EP2_SECTIONS } from './pages/Episode2'
import Episode3, { EP3_SECTIONS } from './pages/Episode3'
import Episode4, { EP4_SECTIONS } from './pages/Episode4'
import Episode5, { EP5_SECTIONS } from './pages/Episode5'
import Episode6, { EP6_SECTIONS } from './pages/Episode6'
import Episode7, { EP7_SECTIONS } from './pages/Episode7'
import Episode8, { EP8_SECTIONS } from './pages/Episode8'

export const EPISODES = [
  { path: '/episode/1', component: Episode1, sections: EP1_SECTIONS, navLabel: '01', navTitle: '推理过程', season: 1 },
  { path: '/episode/2', component: Episode2, sections: EP2_SECTIONS, navLabel: '02', navTitle: '温度与采样', season: 1 },
  { path: '/episode/3', component: Episode3, sections: EP3_SECTIONS, navLabel: '03', navTitle: '注意力机制', season: 1 },
  { path: '/episode/4', component: Episode4, sections: EP4_SECTIONS, navLabel: '04', navTitle: '幻觉', season: 1 },
  { path: '/episode/5', component: Episode5, sections: EP5_SECTIONS, navLabel: '05', navTitle: 'Embedding', season: 2 },
  { path: '/episode/6', component: Episode6, sections: EP6_SECTIONS, navLabel: '06', navTitle: '训练', season: 2 },
  { path: '/episode/7', component: Episode7, sections: EP7_SECTIONS, navLabel: '07', navTitle: 'Transformer 全景', season: 2 },
  { path: '/episode/8', component: Episode8, sections: EP8_SECTIONS, navLabel: '08', navTitle: '对齐与 RLHF', season: 3 },
]

export const SEASON_COLORS = {
  1: { dot: '#22d3ee', label: 'S1 · 推理与生成' },
  2: { dot: '#a78bfa', label: 'S2 · 内部世界' },
  3: { dot: '#34d399', label: 'S3 · 与人类社会' },
}
