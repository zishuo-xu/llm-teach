import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 动画步进引擎：驱动所有教学动画舞台。
 * @param {number} totalSteps 总步数
 * @returns {{ step, playing, speed, play, pause, toggle, next, reset, setSpeed, setStep }}
 */
export function usePlayback(totalSteps, { interval = 1600 } = {}) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const timerRef = useRef(null)

  const clear = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    clear()
    if (!playing) return
    timerRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= totalSteps) {
          setPlaying(false)
          return s
        }
        return s + 1
      })
    }, interval / speed)
    return clear
  }, [playing, speed, totalSteps, interval])

  const play = useCallback(() => {
    setStep((s) => (s >= totalSteps ? 0 : s))
    setPlaying(true)
  }, [totalSteps])

  const pause = useCallback(() => setPlaying(false), [])
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play])
  const next = useCallback(() => {
    setPlaying(false)
    setStep((s) => Math.min(s + 1, totalSteps))
  }, [totalSteps])
  const reset = useCallback(() => {
    setPlaying(false)
    setStep(0)
  }, [])

  return { step, playing, speed, play, pause, toggle, next, reset, setSpeed, setStep }
}
