'use client'
import Image from 'next/image'
import type { Review } from '@/types'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-accent fill-current' : 'text-border fill-current'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function Avatar({ name, photo }: { name: string; photo?: string }) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={name}
        width={40}
        height={40}
        className="rounded-full object-cover"
      />
    )
  }
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['bg-purple-100 text-purple-700', 'bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-orange-100 text-orange-700']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${color}`}>
      {initials}
    </div>
  )
}

export default function Reviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null

  return (
    <section id="reviews" className="py-24 bg-ink text-paper">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-sm font-mono text-muted uppercase tracking-widest mb-3">Client love</p>
          <h2 className="font-display text-5xl md:text-6xl">
            Don&apos;t take
            <br />
            <span className="italic text-accent">my word for it.</span>
          </h2>
        </div>

        {reviews[0] && (
          <blockquote className="border-l-2 border-accent pl-8 mb-16 max-w-3xl">
            <p className="font-display text-2xl md:text-3xl italic leading-snug mb-4">
              &ldquo;{reviews[0].highlight}&rdquo;
            </p>
            <footer className="text-muted text-sm">
              — {reviews[0].clientName}, {reviews[0].clientRole}
            </footer>
          </blockquote>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(review => (
            <div
              key={review.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={review.clientName} photo={review.clientPhoto} />
                  <div>
                    <p className="font-medium text-sm">{review.clientName}</p>
                    <p className="text-xs text-muted">{review.clientRole}</p>
                  </div>
                </div>
                <Stars rating={review.rating} />
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{review.text}</p>
              {review.verified && (
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                  <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Verified client
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
