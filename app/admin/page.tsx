'use client'
import { useState } from 'react'
import { getProjects, addProject, deleteProject, updateProject } from '@/lib/db'
import { getReviews, addReview, deleteReview } from '@/lib/db'
import { getAllTickets, updateTicket } from '@/lib/db'
import type { Project, Review } from '@/types'
import type { Ticket } from '@/lib/db'

const TECH_OPTIONS = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Node.js', 'Supabase', 'React Native', 'Expo', 'PostgreSQL', 'MongoDB', 'Stripe', 'Vercel']

const URGENCY_CONFIG: Record<Ticket['urgency'], { label: string; color: string; dot: string }> = {
  critical: { label: 'P1 — Critical', color: 'bg-red-100 text-red-700 border-red-300',         dot: 'bg-red-500' },
  high:     { label: 'P2 — High',     color: 'bg-orange-100 text-orange-700 border-orange-300', dot: 'bg-orange-500' },
  medium:   { label: 'P3 — Medium',   color: 'bg-amber-100 text-amber-700 border-amber-300',    dot: 'bg-amber-500' },
  low:      { label: 'P4 — Low',      color: 'bg-blue-100 text-blue-700 border-blue-300',       dot: 'bg-blue-500' },
}

const STATUS_CONFIG: Record<Ticket['status'], { label: string; color: string }> = {
  open:          { label: 'Open',        color: 'bg-orange-100 text-orange-700' },
  'in-progress': { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  resolved:      { label: 'Resolved',    color: 'bg-green-100 text-green-700' },
}

// ─── Auth gate ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (pw) { onLogin(pw); setError(false) } else { setError(true) }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="bg-white border border-border rounded-2xl p-10 w-full max-w-sm">
        <h1 className="font-display text-3xl mb-2">Admin</h1>
        <p className="text-muted text-sm mb-8">Portfolio control panel</p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ink"
          />
          {error && <p className="text-red-500 text-xs">Enter your password</p>}
          <button type="submit" className="w-full bg-ink text-paper py-3 rounded-full text-sm font-medium hover:bg-accent hover:text-ink transition-all">
            Enter
          </button>
        </form>
        <a href="/" className="mt-6 block text-center text-sm text-muted hover:text-ink transition-colors">← Back to website</a>
      </div>
    </div>
  )
}

// ─── Project form ────────────────────────────────────────────────────────────

const blankProject = {
  title: '', clientName: '', clientUrl: '', screenshotUrl: '',
  description: '', problem: '', solution: '', outcome: '',
  techStack: [] as string[], category: 'website' as Project['category'],
  industry: '', featured: false, caseStudyUrl: '', completedAt: '',
}

function ProjectForm({ initial, onSaved, onCancel }: {
  initial?: Partial<typeof blankProject> & { id?: string }
  onSaved: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({ ...blankProject, ...initial })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  function set(field: string, value: unknown) { setForm(f => ({ ...f, [field]: value })) }
  function toggleTech(tech: string) {
    set('techStack', form.techStack.includes(tech)
      ? form.techStack.filter(t => t !== tech)
      : [...form.techStack, tech])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (initial?.id) { await updateProject(initial.id, form) }
      else { await addProject(form as Omit<Project, 'id' | 'createdAt'>) }
      onSaved()
    } catch { setMsg('Error saving project') }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Project title" required><input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="E-commerce Platform" className="input" /></Field>
        <Field label="Client name" required><input required value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Acme Corp" className="input" /></Field>
      </div>
      <Field label="Client website URL" required><input required value={form.clientUrl} onChange={e => set('clientUrl', e.target.value)} placeholder="https://clientsite.com" className="input" /></Field>
      <Field label="Screenshot URL (paste image link)">
        <input value={form.screenshotUrl} onChange={e => set('screenshotUrl', e.target.value)} placeholder="https://imgur.com/..." className="input" />
        {form.screenshotUrl && <img src={form.screenshotUrl} alt="Preview" className="mt-2 w-full rounded-xl border border-border object-cover aspect-video" />}
      </Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Category">
          <select value={form.category} onChange={e => set('category', e.target.value)} className="input">
            <option value="website">Website</option>
            <option value="app">App</option>
            <option value="saas">SaaS</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Industry"><input value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="E-commerce" className="input" /></Field>
        <Field label="Completed date"><input type="date" value={form.completedAt} onChange={e => set('completedAt', e.target.value)} className="input" /></Field>
      </div>
      <Field label="Problem"><textarea value={form.problem} onChange={e => set('problem', e.target.value)} rows={2} placeholder="No online presence..." className="input resize-none" /></Field>
      <Field label="Solution"><textarea value={form.solution} onChange={e => set('solution', e.target.value)} rows={2} placeholder="Built a custom site..." className="input resize-none" /></Field>
      <Field label="Outcome / metric"><input value={form.outcome} onChange={e => set('outcome', e.target.value)} placeholder="Launched in 3 weeks · 40% more leads" className="input" /></Field>
      <Field label="Tech stack">
        <div className="flex flex-wrap gap-2 mt-1">
          {TECH_OPTIONS.map(tech => (
            <button key={tech} type="button" onClick={() => toggleTech(tech)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.techStack.includes(tech) ? 'bg-ink text-paper border-ink' : 'border-border text-muted hover:border-ink/40'}`}>
              {tech}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Case study URL (optional)"><input value={form.caseStudyUrl} onChange={e => set('caseStudyUrl', e.target.value)} placeholder="/projects/acme" className="input" /></Field>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-ink" />
        <label htmlFor="featured" className="text-sm">Featured project (shown first)</label>
      </div>
      {msg && <p className="text-sm text-red-500">{msg}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex-1 bg-ink text-paper py-3 rounded-full text-sm font-medium hover:bg-accent hover:text-ink transition-all disabled:opacity-40">
          {loading ? 'Saving...' : initial?.id ? 'Update project' : 'Add project'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-3 border border-border rounded-full text-sm hover:bg-paper transition-all">Cancel</button>
      </div>
    </form>
  )
}

// ─── Review form ─────────────────────────────────────────────────────────────

const blankReview = {
  clientName: '', clientRole: '', clientCompany: '', clientPhoto: '',
  projectId: '', rating: 5, text: '', highlight: '',
  platform: 'direct' as Review['platform'], verified: true,
}

function ReviewForm({ projects, onSaved, onCancel }: { projects: Project[]; onSaved: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({ ...blankReview })
  const [loading, setLoading] = useState(false)
  function set(field: string, value: unknown) { setForm(f => ({ ...f, [field]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await addReview(form as Omit<Review, 'id' | 'createdAt'>)
    setLoading(false)
    onSaved()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Client name" required><input required value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Priya Mehta" className="input" /></Field>
        <Field label="Client role"><input value={form.clientRole} onChange={e => set('clientRole', e.target.value)} placeholder="Founder, StartupXYZ" className="input" /></Field>
      </div>
      <Field label="Project">
        <select value={form.projectId} onChange={e => set('projectId', e.target.value)} className="input">
          <option value="">Select project...</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
        </select>
      </Field>
      <Field label="Rating">
        <div className="flex gap-2 mt-1">
          {[1,2,3,4,5].map(n => (
            <button key={n} type="button" onClick={() => set('rating', n)}
              className={`w-9 h-9 rounded-full text-sm border transition-all ${form.rating >= n ? 'bg-ink text-paper border-ink' : 'border-border text-muted'}`}>
              {n}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Review text (full)"><textarea required value={form.text} onChange={e => set('text', e.target.value)} rows={4} placeholder="Working with [name] was..." className="input resize-none" /></Field>
      <Field label="Highlight quote (one-liner)"><input required value={form.highlight} onChange={e => set('highlight', e.target.value)} placeholder="Best developer I've worked with." className="input" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Platform">
          <select value={form.platform} onChange={e => set('platform', e.target.value)} className="input">
            <option value="direct">Direct</option>
            <option value="linkedin">LinkedIn</option>
            <option value="fiverr">Fiverr</option>
            <option value="upwork">Upwork</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Photo URL (optional)"><input value={form.clientPhoto} onChange={e => set('clientPhoto', e.target.value)} placeholder="https://..." className="input" /></Field>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="verified" checked={form.verified} onChange={e => set('verified', e.target.checked)} className="w-4 h-4 accent-ink" />
        <label htmlFor="verified" className="text-sm">Mark as verified</label>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex-1 bg-ink text-paper py-3 rounded-full text-sm font-medium hover:bg-accent hover:text-ink transition-all disabled:opacity-40">
          {loading ? 'Saving...' : 'Add review'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-3 border border-border rounded-full text-sm hover:bg-paper transition-all">Cancel</button>
      </div>
    </form>
  )
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

// ─── Ticket panel ─────────────────────────────────────────────────────────────

function TicketsPanel({ tickets, onRefresh }: { tickets: Ticket[]; onRefresh: () => void }) {
  const [statusFilter, setStatusFilter] = useState<Ticket['status'] | 'all'>('all')
  const [urgencyFilter, setUrgencyFilter] = useState<Ticket['urgency'] | 'all'>('all')
  const [clientFilter, setClientFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [edit, setEdit] = useState<{ status: Ticket['status']; adminComment: string; resolutionScreenshotUrl: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const uniqueClients = Array.from(new Set(tickets.map(t => t.businessName))).sort()

  const filtered = tickets.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    if (urgencyFilter !== 'all' && t.urgency !== urgencyFilter) return false
    if (clientFilter !== 'all' && t.businessName !== clientFilter) return false
    return true
  })

  const counts = {
    open: tickets.filter(t => t.status === 'open').length,
    'in-progress': tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  }

  function handleExpand(ticket: Ticket) {
    if (expandedId === ticket.id) {
      setExpandedId(null)
      setEdit(null)
    } else {
      setExpandedId(ticket.id)
      setEdit({ status: ticket.status, adminComment: ticket.adminComment, resolutionScreenshotUrl: ticket.resolutionScreenshotUrl })
    }
  }

  async function handleSave(ticketId: string) {
    if (!edit) return
    setSaving(true)
    await updateTicket(ticketId, edit)
    setSaving(false)
    setExpandedId(null)
    setEdit(null)
    onRefresh()
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {([['open', 'Open', 'text-orange-700 bg-orange-50 border-orange-200'], ['in-progress', 'In Progress', 'text-blue-700 bg-blue-50 border-blue-200'], ['resolved', 'Resolved', 'text-green-700 bg-green-50 border-green-200']] as const).map(([key, label, cls]) => (
          <div key={key} className={`border rounded-xl px-4 py-3 ${cls}`}>
            <p className="text-2xl font-display">{counts[key]}</p>
            <p className="text-xs font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted font-mono uppercase tracking-wider">Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as Ticket['status'] | 'all')}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-ink"
          >
            <option value="all">All ({tickets.length})</option>
            <option value="open">Open ({counts.open})</option>
            <option value="in-progress">In Progress ({counts['in-progress']})</option>
            <option value="resolved">Resolved ({counts.resolved})</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-muted font-mono uppercase tracking-wider">Urgency</label>
          <select
            value={urgencyFilter}
            onChange={e => setUrgencyFilter(e.target.value as Ticket['urgency'] | 'all')}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-ink"
          >
            <option value="all">All</option>
            <option value="critical">P1 — Critical</option>
            <option value="high">P2 — High</option>
            <option value="medium">P3 — Medium</option>
            <option value="low">P4 — Low</option>
          </select>
        </div>

        {uniqueClients.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted font-mono uppercase tracking-wider">Client</label>
            <select
              value={clientFilter}
              onChange={e => setClientFilter(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-ink"
            >
              <option value="all">All clients</option>
              {uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {(statusFilter !== 'all' || urgencyFilter !== 'all' || clientFilter !== 'all') && (
          <button
            onClick={() => { setStatusFilter('all'); setUrgencyFilter('all'); setClientFilter('all') }}
            className="text-xs text-muted hover:text-ink transition-colors px-3 py-1.5 border border-border rounded-lg"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Ticket list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-sm">{tickets.length === 0 ? 'No tickets yet.' : 'No tickets match the current filters.'}</p>
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
                className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                  ticket.urgency === 'critical' ? 'border-red-200' :
                  ticket.status === 'resolved' ? 'border-green-200' : 'border-border'
                }`}
              >
                {/* Card header */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${urg.color}`}>
                          {urg.label}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sta.color}`}>
                          {sta.label}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-ink">{ticket.issue}</h3>
                      <p className="text-xs text-muted mt-1">
                        <span className="font-medium text-ink">{ticket.businessName}</span>
                        {' · '}{ticket.service}
                        {' · '}{ticket.contactNumber}
                        {' · '}{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleExpand(ticket)}
                      className="shrink-0 text-xs font-medium border border-border px-4 py-1.5 rounded-full hover:bg-paper transition-all"
                    >
                      {isOpen ? 'Close' : 'Manage'}
                    </button>
                  </div>
                </div>

                {/* Expanded panel */}
                {isOpen && edit && (
                  <div className="border-t border-border px-5 pb-5 pt-4 space-y-4 bg-paper/50">
                    <div>
                      <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">Description</p>
                      <p className="text-sm text-ink">{ticket.description}</p>
                    </div>

                    <div className="border-t border-border pt-4 space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted">Admin Response</p>

                      {/* Status */}
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">Status</label>
                        <div className="flex gap-2">
                          {(['open', 'in-progress', 'resolved'] as const).map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setEdit(prev => prev ? { ...prev, status: s } : prev)}
                              className={`text-xs px-4 py-1.5 rounded-full border transition-all capitalize ${
                                edit.status === s
                                  ? s === 'resolved' ? 'bg-green-600 text-white border-green-600'
                                    : s === 'in-progress' ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-orange-500 text-white border-orange-500'
                                  : 'border-border text-muted hover:border-ink/40'
                              }`}
                            >
                              {s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">Resolution Notes</label>
                        <textarea
                          value={edit.adminComment}
                          onChange={e => setEdit(prev => prev ? { ...prev, adminComment: e.target.value } : prev)}
                          rows={3}
                          placeholder="Describe what was done to resolve the issue…"
                          className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ink resize-none bg-white"
                        />
                      </div>

                      {/* Screenshot */}
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-1.5">Screenshot URL (optional)</label>
                        <input
                          type="url"
                          value={edit.resolutionScreenshotUrl}
                          onChange={e => setEdit(prev => prev ? { ...prev, resolutionScreenshotUrl: e.target.value } : prev)}
                          placeholder="https://imgur.com/..."
                          className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ink bg-white"
                        />
                        {edit.resolutionScreenshotUrl && (
                          <img src={edit.resolutionScreenshotUrl} alt="Preview" className="mt-2 w-full max-h-48 object-contain rounded-xl border border-border" />
                        )}
                      </div>

                      <button
                        onClick={() => handleSave(ticket.id)}
                        disabled={saving}
                        className="bg-ink text-paper text-sm font-medium px-8 py-2.5 rounded-full hover:bg-accent hover:text-ink transition-all disabled:opacity-40"
                      >
                        {saving ? 'Saving…' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main admin page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<'projects' | 'reviews' | 'tickets'>('tickets')
  const [projects, setProjects] = useState<Project[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)

  async function load() {
    const [p, r, t] = await Promise.all([getProjects(), getReviews(), getAllTickets()])
    setProjects(p)
    setReviews(r)
    setTickets(t)
  }

  function handleLogin(pw: string) {
    if (pw === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthed(true)
      load()
    } else {
      alert('Wrong password')
    }
  }

  if (!authed) return <LoginScreen onLogin={handleLogin} />

  const openTickets = tickets.filter(t => t.status === 'open').length

  return (
    <div className="min-h-screen bg-paper">
      <style>{`.input { width: 100%; border: 1px solid #E2DDD4; border-radius: 12px; padding: 10px 14px; font-size: 14px; background: white; outline: none; transition: border-color 0.15s; } .input:focus { border-color: #0D0D0D; }`}</style>

      <header className="bg-white border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl">Admin panel</h1>
            <p className="text-xs text-muted">Portfolio CMS</p>
          </div>
          <a href="/" className="text-sm text-muted hover:text-ink transition-colors">← View site</a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-full p-1 w-fit mb-8">
          {(['tickets', 'projects', 'reviews'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative capitalize text-sm px-5 py-2 rounded-full transition-all ${
                tab === t ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
              }`}
            >
              {t === 'tickets' ? 'Tickets' : t === 'projects' ? 'Projects' : 'Reviews'}
              {t === 'tickets' && openTickets > 0 && (
                <span className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  tab === 'tickets' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'
                }`}>
                  {openTickets}
                </span>
              )}
              {t === 'projects' && <span className="ml-1.5 text-xs opacity-60">({projects.length})</span>}
              {t === 'reviews' && <span className="ml-1.5 text-xs opacity-60">({reviews.length})</span>}
            </button>
          ))}
        </div>

        {/* ── Tickets tab ── */}
        {tab === 'tickets' && (
          <TicketsPanel tickets={tickets} onRefresh={load} />
        )}

        {/* ── Projects tab ── */}
        {tab === 'projects' && (
          <div>
            {!showProjectForm && !editProject && (
              <button onClick={() => setShowProjectForm(true)} className="mb-6 bg-ink text-paper px-6 py-3 rounded-full text-sm font-medium hover:bg-accent hover:text-ink transition-all">
                + Add project
              </button>
            )}
            {(showProjectForm || editProject) && (
              <div className="bg-white border border-border rounded-2xl p-8 mb-8">
                <h2 className="font-display text-2xl mb-6">{editProject ? 'Edit project' : 'New project'}</h2>
                <ProjectForm
                  initial={editProject || undefined}
                  onSaved={() => { load(); setShowProjectForm(false); setEditProject(null) }}
                  onCancel={() => { setShowProjectForm(false); setEditProject(null) }}
                />
              </div>
            )}
            <div className="space-y-4">
              {projects.map(p => (
                <div key={p.id} className="bg-white border border-border rounded-2xl p-5 flex items-center gap-5">
                  {p.screenshotUrl && <img src={p.screenshotUrl} alt="" className="w-28 h-16 rounded-xl object-cover object-top flex-shrink-0 border border-border" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{p.title}</h3>
                      {p.featured && <span className="text-xs bg-accent/20 text-ink px-2 py-0.5 rounded-full">Featured</span>}
                      <span className="text-xs border border-border px-2 py-0.5 rounded-full text-muted capitalize">{p.category}</span>
                    </div>
                    <p className="text-xs text-muted">{p.clientName} · {p.outcome}</p>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {p.techStack.slice(0, 4).map(t => <span key={t} className="text-xs bg-paper px-2 py-0.5 rounded-full text-muted">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setEditProject(p)} className="text-xs border border-border px-3 py-1.5 rounded-full hover:bg-paper transition-all">Edit</button>
                    <button onClick={async () => { if (confirm(`Delete "${p.title}"?`)) { await deleteProject(p.id); load() } }} className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-full hover:bg-red-50 transition-all">Delete</button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && !showProjectForm && <p className="text-center text-muted py-12">No projects yet.</p>}
            </div>
          </div>
        )}

        {/* ── Reviews tab ── */}
        {tab === 'reviews' && (
          <div>
            {!showReviewForm && (
              <button onClick={() => setShowReviewForm(true)} className="mb-6 bg-ink text-paper px-6 py-3 rounded-full text-sm font-medium hover:bg-accent hover:text-ink transition-all">
                + Add review
              </button>
            )}
            {showReviewForm && (
              <div className="bg-white border border-border rounded-2xl p-8 mb-8">
                <h2 className="font-display text-2xl mb-6">New review</h2>
                <ReviewForm projects={projects} onSaved={() => { load(); setShowReviewForm(false) }} onCancel={() => setShowReviewForm(false)} />
              </div>
            )}
            <div className="space-y-3">
              {reviews.map(r => (
                <div key={r.id} className="bg-white border border-border rounded-2xl p-5 flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{r.clientName}</h3>
                      <span className="text-xs text-muted">{r.clientRole}</span>
                      <span className="text-xs font-mono text-amber-600">{'★'.repeat(r.rating)}</span>
                      {r.verified && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Verified</span>}
                    </div>
                    <p className="text-xs text-muted italic mb-1">&ldquo;{r.highlight}&rdquo;</p>
                    <p className="text-xs text-muted line-clamp-2">{r.text}</p>
                  </div>
                  <button onClick={async () => { if (confirm(`Delete review from ${r.clientName}?`)) { await deleteReview(r.id); load() } }} className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-full hover:bg-red-50 transition-all flex-shrink-0">
                    Delete
                  </button>
                </div>
              ))}
              {reviews.length === 0 && !showReviewForm && <p className="text-center text-muted py-12">No reviews yet.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
