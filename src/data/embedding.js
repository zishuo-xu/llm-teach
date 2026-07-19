// 第五期数据：二维语义地图坐标（示意，真实 embedding 有几百上千维）

export const SEMANTIC_WORDS = [
  // 动物簇
  { word: '猫', x: 20, y: 78, cluster: '动物' },
  { word: '狗', x: 26, y: 72, cluster: '动物' },
  { word: '老虎', x: 14, y: 84, cluster: '动物' },
  // 水果簇
  { word: '苹果', x: 78, y: 28, cluster: '水果' },
  { word: '香蕉', x: 85, y: 22, cluster: '水果' },
  { word: '梨', x: 74, y: 20, cluster: '水果' },
  // 科技簇
  { word: '电脑', x: 74, y: 84, cluster: '科技' },
  { word: '手机', x: 82, y: 78, cluster: '科技' },
  { word: '算法', x: 68, y: 90, cluster: '科技' },
  // 情绪簇
  { word: '开心', x: 30, y: 20, cluster: '情绪' },
  { word: '难过', x: 20, y: 14, cluster: '情绪' },
  { word: '愤怒', x: 25, y: 7, cluster: '情绪' },
]

export const CLUSTER_COLORS = {
  动物: '#4ade80',
  水果: '#fb923c',
  科技: '#22d3ee',
  情绪: '#f472b6',
}

// §3 向量算术（0-10 坐标系）
export const ARITHMETIC = [
  {
    label: '国王 − 男人 + 女人 ≈ ？',
    a: { word: '国王', x: 7, y: 3 },
    b: { word: '男人', x: 2, y: 1 },
    c: { word: '女人', x: 2, y: 3 },
    others: [
      { word: '王子', x: 6.2, y: 2.6 },
      { word: '苹果', x: 1, y: 9 },
    ],
    answer: { word: '女王', x: 6.8, y: 4.8 },
  },
  {
    label: '巴黎 − 法国 + 中国 ≈ ？',
    a: { word: '巴黎', x: 3, y: 7 },
    b: { word: '法国', x: 2, y: 5 },
    c: { word: '中国', x: 6, y: 6 },
    others: [
      { word: '伦敦', x: 3.4, y: 7.4 },
      { word: '香蕉', x: 9, y: 1 },
    ],
    answer: { word: '北京', x: 6.8, y: 7.9 },
  },
]

/** 计算 a - b + c 的落点 */
export function arithmeticResult({ a, b, c }) {
  return { x: a.x - b.x + c.x, y: a.y - b.y + c.y }
}

/** 欧氏距离 */
export function dist(p, q) {
  return Math.hypot(p.x - q.x, p.y - q.y)
}
