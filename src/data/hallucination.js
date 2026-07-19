// 第四期数据：幻觉案例、采样漂移分布、RAG 语料（均为教学构造）

// §1 翻车现场：一个"错误前提"问题 —— 《蛙》根本没有续集
export const TRAP_QUESTION = '请介绍一下莫言获得诺贝尔文学奖的作品《蛙》的续集'
export const TRAP_ANSWER =
  '《蛙》的续集《蛙声依旧》于2015年出版，延续了姑姑的故事线，讲述了她在新世纪面对生育观念巨变时的内心挣扎。该书出版后广受好评，被认为比前作更具人文关怀……'
export const TRAP_FACTS = [
  '《蛙》没有续集 —— 前提就是错的',
  '《蛙声依旧》这个书名是编的',
  '出版年份、情节、评价全是编的',
]

// §3 采样漂移：一个模型"基本知道"的问题，但长尾里有错误答案
export const DRIFT_QUESTION = '刘慈欣凭借哪部作品获得雨果奖？'
export const DRIFT_CANDIDATES = [
  { token: '《三体》', logit: 3.0, correct: true },
  { token: '《流浪地球》', logit: 1.2, correct: false },
  { token: '《球状闪电》', logit: 0.5, correct: false },
  { token: '《北京折叠》', logit: -0.5, correct: false }, // 郝景芳的作品，张冠李戴
]

// §4 RAG：问一个训练数据里根本不存在的东西
export const RAG_QUESTION = '介绍一下你们公司 2024 年发布的 Zephyr-X 芯片'
export const RAG_HALLUCINATED =
  'Zephyr-X 采用 7nm 工艺，搭载 16 核 GPU，主打移动端游戏市场，售价约 2000 元……'
export const RAG_DOCS = [
  { id: 1, title: '内部新闻稿（2024.3）', text: 'Zephyr-X 为公司首款 3nm AI 推理芯片，集成 8 核 NPU。' },
  { id: 2, title: '产品规格书 v1.2', text: '典型功耗 5W，面向边缘计算场景，暂不对外零售。' },
]
export const RAG_GROUNDED =
  '根据检索到的资料：Zephyr-X 是 3nm AI 推理芯片，集成 8 核 NPU[1]，功耗 5W，面向边缘计算、不零售[2]。资料中未提及售价。'
