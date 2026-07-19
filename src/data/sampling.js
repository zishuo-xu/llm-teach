// 第二期数据：模型对下一个 token 输出的原始 logits（示意数据）

export const SAMPLING_CONTEXT = '今天的天气真'

// 候选 token 及其 logit 分数（未归一化）
export const LOGITS = [
  { token: '好', logit: 4.5 },
  { token: '不错', logit: 3.2 },
  { token: '糟糕', logit: 2.0 },
  { token: '冷', logit: 1.4 },
  { token: '热', logit: 1.0 },
  { token: '蓝', logit: 0.2 },
  { token: '苹果', logit: -1.5 },
  { token: '算法', logit: -2.5 },
]

/** softmax(logits / T)：温度 T 越低分布越尖锐，越高越平坦 */
export function softmax(logits, temperature = 1) {
  const scaled = logits.map((l) => l / Math.max(temperature, 1e-6))
  const max = Math.max(...scaled)
  const exps = scaled.map((s) => Math.exp(s - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}

/** Top-p 截断：按概率降序累积，保留刚好超过 p 的最小集合，其余归零后重新归一化 */
export function topP(probs, p) {
  const indexed = probs.map((prob, i) => ({ i, prob })).sort((a, b) => b.prob - a.prob)
  const kept = new Set()
  let acc = 0
  for (const { i, prob } of indexed) {
    if (acc >= p) break
    kept.add(i)
    acc += prob
  }
  const result = probs.map((prob, i) => (kept.has(i) ? prob : 0))
  const sum = result.reduce((a, b) => a + b, 0)
  return {
    kept,
    acc,
    probs: sum > 0 ? result.map((r) => r / sum) : result,
  }
}

/** 按概率分布随机采样一个下标 */
export function sampleIndex(probs) {
  const r = Math.random()
  let acc = 0
  for (let i = 0; i < probs.length; i++) {
    acc += probs[i]
    if (r < acc) return i
  }
  return probs.length - 1
}
