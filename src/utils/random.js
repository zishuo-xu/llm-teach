/**
 * 确定性伪随机序列（LCG）：同样的 seed 产生同样的序列，
 * 保证动画每次渲染/重放结果一致。
 */
export function makeRandomStream(seed = 42) {
  let x = seed
  return () => {
    x = (x * 48271) % 2147483647
    return (x & 0xffff) / 0x10000
  }
}
