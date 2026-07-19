// 教学用的预置数据：分词结果与概率分布均为示意（真实分词器如 BPE 结果会更细碎）

export const tokenizeExamples = [
  {
    label: '中文句子',
    text: '大模型如何思考',
    tokens: [
      { text: '大', id: 1204 },
      { text: '模型', id: 8831 },
      { text: '如何', id: 2266 },
      { text: '思考', id: 5407 },
    ],
  },
  {
    label: '英文句子',
    text: 'Tokenization matters',
    tokens: [
      { text: 'Token', id: 3064 },
      { text: 'ization', id: 918 },
      { text: ' matters', id: 5323 },
    ],
  },
  {
    label: '代码片段',
    text: 'print("hi")',
    tokens: [
      { text: 'print', id: 7701 },
      { text: '("', id: 334 },
      { text: 'hi', id: 8820 },
      { text: '")', id: 519 },
    ],
  },
]

// §2 自回归生成：给定上文，逐步生成，每步给出 top-5 候选分布
export const generationScript = {
  prompt: ['大', '模型', '是', '如何'],
  steps: [
    {
      token: '思考',
      candidates: [
        { token: '思考', prob: 0.42 },
        { token: '工作', prob: 0.21 },
        { token: '学习', prob: 0.13 },
        { token: '推理', prob: 0.11 },
        { token: '运行', prob: 0.06 },
      ],
    },
    {
      token: '的',
      candidates: [
        { token: '的', prob: 0.55 },
        { token: '出', prob: 0.18 },
        { token: '并', prob: 0.09 },
        { token: '呢', prob: 0.07 },
        { token: '，', prob: 0.05 },
      ],
    },
    {
      token: '呢',
      candidates: [
        { token: '呢', prob: 0.48 },
        { token: '答案', prob: 0.19 },
        { token: '过程', prob: 0.14 },
        { token: '？', prob: 0.1 },
        { token: '秘密', prob: 0.04 },
      ],
    },
    {
      token: '？',
      candidates: [
        { token: '？', prob: 0.72 },
        { token: '。', prob: 0.12 },
        { token: '！', prob: 0.06 },
        { token: '<end>', prob: 0.05 },
        { token: '，', prob: 0.03 },
      ],
    },
  ],
}

// Token 配色循环（与 index.css 中的 --color-token-* 对应）
export const TOKEN_COLORS = [
  '#22d3ee',
  '#a78bfa',
  '#fb923c',
  '#4ade80',
  '#f472b6',
  '#facc15',
  '#60a5fa',
  '#f87171',
]

export function tokenColor(index) {
  return TOKEN_COLORS[index % TOKEN_COLORS.length]
}
