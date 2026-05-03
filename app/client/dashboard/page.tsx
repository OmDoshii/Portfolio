'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useClientAuth } from '../auth-context'
import { addTicket, getTickets, Ticket } from '@/lib/db'

const STATUS_STYLES: Record<Ticket['status'], string> = {
  open: 'bg-orange-100 text-orange-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
}

const STATUS_LABELS: Record<Ticket['status'], string> = {
  open: 'Open',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
}

export default function ClientDashboard() {
  const { client, logout } = useClientAuth()
  const router = useRouter()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loadingTickets, setLoadingTickets] = useState(true)

  const [issue, setIssue] = useState('')
  const [description, setDescription] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const fetchTickets = useCallback(async () => {
    if (!client) return
    setLoadingTickets(true)
    try {
      const data = await getTickets(client.username)
      setTickets(data)
    } finally {
      setLoadingTickets(false)
    }
  }, [client])

  useEffect(() => {
    if (!client) {
      router.replace('/client')
      return
    }
    fetchTickets()
  }, [client, router, fetchTickets])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!client) return
    setSubmitting(true)
    setSubmitError('')

    try {
      await addTicket(client.username, { issue, description, contactNumber })
      setIssue('')
      setDescription('')
      setContactNumber('')
      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 4000)
      fetchTickets()
    } catch {
      setSubmitError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleLogout() {
    logout()
    router.push('/client')
  }

  if (!client) return null

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-display text-lg text-ink">
            Oriange<span className="text-accent">.</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted hidden sm:block">{client.businessName}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-display text-ink">
            Welcome, {client.businessName}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Service:{' '}
            <span className="text-ink font-medium">{client.service}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Raise a ticket */}
          <div>
            <h2 className="text-xl font-display text-ink mb-4">Raise a Ticket</h2>
            <div className="bg-card border border-border rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    Issue
                  </label>
                  <input
                    type="text"
                    value={issue}
                    onChange={e => setIssue(e.target.value)}
                    placeholder="Briefly describe your issue"
                    required
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Explain the issue in detail…"
                    required
                    rows={4}
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={e => setContactNumber(e.target.value)}
                    placeholder="Your phone number"
                    required
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                  />
                </div>

                {submitError && (
                  <p className="text-red-500 text-sm">{submitError}</p>
                )}
                {submitSuccess && (
                  <p className="text-green-600 text-sm font-medium">
                    Ticket submitted! We&apos;ll be in touch soon.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-accent text-white font-medium py-2.5 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {submitting ? 'Submitting…' : 'Submit Ticket'}
                </button>
              </form>
            </div>
          </div>

          {/* Ticket history */}
          <div>
            <h2 className="text-xl font-display text-ink mb-4">Your Tickets</h2>

            {loadingTickets ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-xl p-4 animate-pulse"
                  >
                    <div className="h-4 bg-border rounded w-3/4 mb-2" />
                    <div className="h-3 bg-border rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-6 text-center">
                <p className="text-muted text-sm">No tickets raised yet.</p>
                <p className="text-muted/70 text-xs mt-1">
                  Use the form to raise your first ticket.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map(ticket => (
                  <div
                    key={ticket.id}
                    className="bg-card border border-border rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-ink leading-snug">
                        {ticket.issue}
                      </p>
                      <span
                        className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[ticket.status] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {STATUS_LABELS[ticket.status] ?? ticket.status}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted line-clamp-2">
                      {ticket.description}
                    </p>
                    <p className="mt-2 text-xs text-muted/60">
                      {ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
