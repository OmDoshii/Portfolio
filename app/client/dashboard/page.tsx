'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useClientAuth } from '../auth-context'
import { addTicket, getClientTickets, Ticket } from '@/lib/db'

const URGENCY_CONFIG: Record<Ticket['urgency'], { label: string; color: string; dot: string }> = {
  critical: { label: 'P1 — Critical', color: 'bg-red-100 text-red-700 border-red-300',    dot: 'bg-red-500' },
  high:     { label: 'P2 — High',     color: 'bg-orange-100 text-orange-700 border-orange-300', dot: 'bg-orange-500' },
  medium:   { label: 'P3 — Medium',   color: 'bg-amber-100 text-amber-700 border-amber-300',  dot: 'bg-amber-500' },
  low:      { label: 'P4 — Low',      color: 'bg-blue-100 text-blue-700 border-blue-300',   dot: 'bg-blue-500' },
}

const STATUS_CONFIG: Record<Ticket['status'], { label: string; color: string }> = {
  open:          { label: 'Open',        color: 'bg-orange-100 text-orange-700' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  resolved:      { label: 'Resolved',    color: 'bg-green-100 text-green-700' },
}

const STATUS_FILTERS = [
  { value: 'all' as const,          label: 'All' },
  { value: 'open' as const,         label: 'Open' },
  { value: 'in-progress' as const,  label: 'In Progress' },
  { value: 'resolved' as const,     label: 'Resolved' },
]

export default function ClientDashboard() {
  const { client, logout } = useClientAuth()
  const router = useRouter()

  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loadingTickets, setLoadingTickets] = useState(true)
  const [statusFilter, setStatusFilter] = useState<Ticket['status'] | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [issue, setIssue] = useState('')
  const [description, setDescription] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [urgency, setUrgency] = useState<Ticket['urgency']>('medium')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [mobileTab, setMobileTab] = useState<'form' | 'tickets'>('tickets')

  const fetchTickets = useCallback(async () => {
    if (!client) return
    setLoadingTickets(true)
    try {
      const data = await getClientTickets(client.username)
      setTickets(data)
    } finally {
      setLoadingTickets(false)
    }
  }, [client])

  useEffect(() => {
    if (!client) { router.replace('/client'); return }
    fetchTickets()
  }, [client, router, fetchTickets])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!client) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await addTicket(
        { username: client.username, businessName: client.businessName, service: client.service },
        { issue, description, contactNumber, urgency }
      )
      setIssue('')
      setDescription('')
      setContactNumber('')
      setUrgency('medium')
      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 4000)
      setMobileTab('tickets')
      fetchTickets()
    } catch {
      setSubmitError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = statusFilter === 'all' ? tickets : tickets.filter(t => t.status === statusFilter)

  if (!client) return null

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-display text-lg text-ink">
            Oriange<span className="text-accent">.</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted hidden sm:block">{client.businessName}</span>
            <button onClick={() => { logout(); router.push('/client') }} className="text-sm text-muted hover:text-ink transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-display text-ink">Welcome, {client.businessName}</h1>
          <p className="mt-1 text-sm text-muted">
            Service: <span className="text-ink font-medium">{client.service}</span>
          </p>
        </div>

        {/* Mobile tab switcher */}
        <div className="flex md:hidden gap-1 bg-card border border-border rounded-full p-1 w-fit mb-6">
          <button
            onClick={() => setMobileTab('form')}
            className={`text-sm px-4 py-1.5 rounded-full transition-all ${mobileTab === 'form' ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
          >
            Raise Ticket
          </button>
          <button
            onClick={() => setMobileTab('tickets')}
            className={`text-sm px-4 py-1.5 rounded-full transition-all ${mobileTab === 'tickets' ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
          >
            My Tickets{tickets.length > 0 && ` (${tickets.length})`}
          </button>
        </div>

        <div className="grid md:grid-cols-[380px_1fr] gap-8 items-start">
          {/* ── Raise a ticket ── */}
          <div className={`${mobileTab === 'tickets' ? 'hidden md:block' : ''} md:sticky md:top-24`}>
            <h2 className="text-xl font-display text-ink mb-4">Raise a Ticket</h2>
            <div className="bg-card border border-border rounded-2xl p-6">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Priority</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(URGENCY_CONFIG) as [Ticket['urgency'], typeof URGENCY_CONFIG[Ticket['urgency']]][]).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setUrgency(key)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                          urgency === key ? cfg.color : 'border-border text-muted hover:border-ink/30'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Issue</label>
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
                  <label className="block text-sm font-medium text-ink mb-1.5">Description</label>
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
                  <label className="block text-sm font-medium text-ink mb-1.5">Contact Number</label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={e => setContactNumber(e.target.value)}
                    placeholder="Your phone number"
                    required
                    className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                  />
                </div>

                {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
                {submitSuccess && (
                  <p className="text-green-600 text-sm font-medium">Ticket submitted! We&apos;ll be in touch soon.</p>
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

          {/* ── Ticket list ── */}
          <div className={mobileTab === 'form' ? 'hidden md:block' : ''}>
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <h2 className="text-xl font-display text-ink">
                Your Tickets
                {tickets.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted">({tickets.length})</span>
                )}
              </h2>
              {tickets.length > 0 && (
                <div className="flex gap-1 bg-card border border-border rounded-full p-1">
                  {STATUS_FILTERS.map(f => (
                    <button
                      key={f.value}
                      onClick={() => setStatusFilter(f.value)}
                      className={`text-xs px-3 py-1 rounded-full transition-all ${
                        statusFilter === f.value ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loadingTickets ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
                    <div className="h-4 bg-border rounded w-3/4 mb-2" />
                    <div className="h-3 bg-border rounded w-1/4" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <p className="text-muted text-sm">
                  {statusFilter === 'all' ? 'No tickets raised yet.' : `No ${statusFilter} tickets.`}
                </p>
                {statusFilter === 'all' && (
                  <p className="text-muted/70 text-xs mt-1">Use the form to raise your first ticket.</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(ticket => {
                  const urg = URGENCY_CONFIG[ticket.urgency] ?? URGENCY_CONFIG.medium
                  const sta = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.open
                  const isOpen = expandedId === ticket.id

                  return (
                    <div
                      key={ticket.id}
                      className={`bg-card border rounded-xl overflow-hidden transition-all ${
                        ticket.status === 'resolved' ? 'border-green-200' : 'border-border'
                      }`}
                    >
                      <button
                        type="button"
                        className="w-full text-left p-4"
                        onClick={() => setExpandedId(isOpen ? null : ticket.id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${urg.color}`}>
                              {urg.label}
                            </span>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sta.color}`}>
                              {sta.label}
                            </span>
                          </div>
                          <span className="text-muted text-xs shrink-0 mt-0.5">{isOpen ? '▲' : '▼'}</span>
                        </div>
                        <p className="mt-2 text-sm font-medium text-ink text-left">{ticket.issue}</p>
                        <p className="mt-1 text-xs text-muted">
                          {ticket.createdAt
                            ? new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : '—'}
                        </p>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                          <div>
                            <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">Description</p>
                            <p className="text-sm text-ink">{ticket.description}</p>
                          </div>
                          <div>
                            <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">Contact</p>
                            <p className="text-sm text-ink">{ticket.contactNumber}</p>
                          </div>

                          {ticket.status === 'in-progress' && (
                            <div className="mt-2 pt-3 border-t border-border">
                              <p className="text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
                                Your ticket is being worked on. We&apos;ll update you soon.
                              </p>
                            </div>
                          )}

                          {ticket.status === 'resolved' && (
                            <div className="mt-2 pt-3 border-t border-green-200 space-y-3">
                              <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">Resolution</p>
                              {ticket.adminComment ? (
                                <div>
                                  <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">Admin Notes</p>
                                  <p className="text-sm text-ink bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                    {ticket.adminComment}
                                  </p>
                                </div>
                              ) : null}
                              {ticket.resolutionScreenshotUrl ? (
                                <div>
                                  <p className="text-xs font-mono text-muted uppercase tracking-wider mb-2">Screenshot</p>
                                  <img
                                    src={ticket.resolutionScreenshotUrl}
                                    alt="Resolution screenshot"
                                    className="w-full rounded-lg border border-green-200 object-contain max-h-64"
                                  />
                                </div>
                              ) : null}
                              {!ticket.adminComment && !ticket.resolutionScreenshotUrl && (
                                <p className="text-sm text-green-700">Issue has been marked as resolved.</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
