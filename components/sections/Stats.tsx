'use client'
import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 2, suffix: '+', label: 'Projects delivered' },
  { value: 2, suffix: '', label: 'Happy clients' },
  { value: 100, suffix: '%', label: 'On-time delivery' },
  { value: 3, suffix: 'wk', label: 'Avg. delivery time' },
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1800
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(ease * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="border-y border-border bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={i} className="text-center">
            <div className="font-display text-5xl md:text-6xl mb-2">
              <CountUp target={s.value} suffix={s.suffix} />
            </div>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
