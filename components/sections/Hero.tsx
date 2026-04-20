'use client'
import { useEffect, useState } from 'react'

const roles = ['SaaS Platforms', 'Web Applications', 'Business Websites', 'MVPs']

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setRoleIndex(i => (i + 1) % roles.length)
        setVisible(true)
      }, 300)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="min-h-screen flex flex-col justify-center pt-24 pb-16 px-6 max-w-6xl mx-auto">
      {/* Availability badge */}
      <div className="fade-up fade-up-1 mb-10">
        <span className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-4 py-2 text-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Available for new projects
        </span>
      </div>

      {/* Headline */}
      <h1 className="fade-up fade-up-2 font-display text-6xl md:text-8xl leading-[1.05] tracking-tight mb-6 max-w-4xl">
        I build{' '}
        <span
          className={`italic text-muted transition-opacity duration-300 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {roles[roleIndex]}
        </span>
        <br />
        that work.
      </h1>

      <p className="fade-up fade-up-3 text-lg text-muted max-w-xl mb-10 leading-relaxed">
        Freelance developer based in India. I help startups and businesses
        ship fast, scalable products — from MVP to production.
      </p>

      <div className="fade-up fade-up-4 flex flex-wrap gap-4">
        <a
          href="#work"
          className="bg-ink text-paper px-8 py-3.5 rounded-full font-medium hover:bg-accent hover:text-ink transition-all duration-200"
        >
          See my work
        </a>
        <a
          href="#contact"
          className="border border-ink text-ink px-8 py-3.5 rounded-full font-medium hover:bg-ink hover:text-paper transition-all duration-200"
        >
          Start a project →
        </a>
      </div>

      {/* Scroll hint */}
      <div className="fade-up fade-up-5 mt-24 flex items-center gap-3 text-muted text-sm">
        <div className="w-px h-12 bg-border" />
        Scroll to explore
      </div>
    </section>
  )
}
