'use client'
import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      await addDoc(collection(db, 'leads'), {
        ...data,
        createdAt: serverTimestamp(),
      })
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        {/* Left */}
        <div>
          <p className="text-sm font-mono text-muted uppercase tracking-widest mb-3">Let&apos;s work together</p>
          <h2 className="font-display text-5xl md:text-6xl mb-6">
            Got a project
            <br />
            <span className="italic text-muted">in mind?</span>
          </h2>
          <p className="text-muted leading-relaxed mb-8">
            Tell me what you&apos;re building. I&apos;ll get back to you within 24 hours
            with honest thoughts on scope, timeline, and cost.
          </p>
          <div className="space-y-3 text-sm">
            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-muted hover:text-ink transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">W</span>
              WhatsApp — quick response
            </a>
            <a
              href="mailto:you@yourdomain.com"
              className="flex items-center gap-3 text-muted hover:text-ink transition-colors"
            >
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">@</span>
              you@yourdomain.com
            </a>
          </div>
        </div>

        {/* Right — form */}
        {submitted ? (
          <div className="bg-accent/20 border border-accent/40 rounded-2xl p-12 text-center">
            <div className="font-display text-3xl mb-2">Got it!</div>
            <p className="text-muted text-sm">I&apos;ll be in touch within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">Name</label>
                <input
                  name="name"
                  required
                  placeholder="Rahul Sharma"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-ink transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">Budget</label>
                <select
                  name="budget"
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-ink transition-colors"
                >
                  <option>Under ₹15k</option>
                  <option>₹15k – ₹50k</option>
                  <option>₹50k – ₹1L</option>
                  <option>Above ₹1L</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="rahul@company.com"
                className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-ink transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">What are you building?</label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell me about your project — what problem it solves, who it's for, and when you need it..."
                className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-ink transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">Timeline</label>
              <select
                name="timeline"
                className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-ink transition-colors"
              >
                <option>ASAP</option>
                <option>Within 1 month</option>
                <option>1–3 months</option>
                <option>Flexible</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-paper py-4 rounded-full font-medium hover:bg-accent hover:text-ink transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send project brief →'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
