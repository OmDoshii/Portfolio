'use client'
import { useState } from 'react'
import { getProjects, addProject, deleteProject, updateProject } from '@/lib/db'
import { getReviews, addReview, deleteReview } from '@/lib/db'
import type { Project, Review } from '@/types'

const TECH_OPTIONS = ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Node.js', 'Supabase', 'React Native', 'Expo', 'PostgreSQL', 'MongoDB', 'Stripe', 'Vercel']

// ─── Auth gate ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (pw) {
      onLogin(pw)
      setError(false)
    } else {
      setError(true)
    }
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
        <a href="/" className="mt-6 block text-center text-sm text-muted hover:text-ink transition-colors">
          ← Back to website
        </a>
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

function ProjectForm({
  initial, onSaved, onCancel,
}: {
  initial?: Partial<typeof blankProject> & { id?: string }
  onSaved: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({ ...blankProject, ...initial })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  function set(field: string, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function toggleTech(tech: string) {
    set('techStack', form.techStack.includes(tech)
      ? form.techStack.filter(t => t !== tech)
      : [...form.techStack, tech])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (initial?.id) {
        await updateProject(initial.id, form)
      } else {
        await addProject(form as Omit<Project, 'id' | 'createdAt'>)
      }
      onSaved()
    } catch (err) {
      setMsg('Error saving project')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Project title" required>
          <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="E-commerce Platform" className="input" />
        </Field>
        <Field label="Client name" required>
          <input required value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Acme Corp" className="input" />
        </Field>
      </div>

      <Field label="Client website URL" required>
        <input required value={form.clientUrl} onChange={e => set('clientUrl', e.target.value)} placeholder="https://clientsite.com" className="input" />
      </Field>

      <Field label="Screenshot URL (paste image link)">
        <input value={form.screenshotUrl} onChange={e => set('screenshotUrl', e.target.value)} placeholder="https://imgur.com/..." className="input" />
        {form.screenshotUrl && (
          <img src={form.screenshotUrl} alt="Preview" className="mt-2 w-full rounded-xl border border-border object-cover aspect-video" />
        )}
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
        <Field label="Industry">
          <input value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="E-commerce" className="input" />
        </Field>
        <Field label="Completed date">
          <input type="date" value={form.completedAt} onChange={e => set('completedAt', e.target.value)} className="input" />
        </Field>
      </div>

      <Field label="Problem (what challenge did the client have?)">
        <textarea value={form.problem} onChange={e => set('problem', e.target.value)} rows={2} placeholder="No online presence to accept orders..." className="input resize-none" />
      </Field>
      <Field label="Solution (what did you build?)">
        <textarea value={form.solution} onChange={e => set('solution', e.target.value)} rows={2} placeholder="Built a custom e-commerce site with Stripe..." className="input resize-none" />
      </Field>
      <Field label="Outcome / metric (the result)">
        <input value={form.outcome} onChange={e => set('outcome', e.target.value)} placeholder="Launched in 3 weeks · 40% more leads" className="input" />
      </Field>

      <Field label="Tech stack">
        <div className="flex flex-wrap gap-2 mt-1">
          {TECH_OPTIONS.map(tech => (
            <button
              key={tech}
              type="button"
              onClick={() => toggleTech(tech)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                form.techStack.includes(tech)
                  ? 'bg-ink text-paper border-ink'
                  : 'border-border text-muted hover:border-ink/40'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Case study URL (optional)">
        <input value={form.caseStudyUrl} onChange={e => set('caseStudyUrl', e.target.value)} placeholder="/projects/acme" className="input" />
      </Field>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={e => set('featured', e.target.checked)}
          className="w-4 h-4 accent-ink"
        />
        <label htmlFor="featured" className="text-sm">Featured project (shown first)</label>
      </div>

      {msg && <p className={`text-sm ${msg.includes('!') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex-1 bg-ink text-paper py-3 rounded-full text-sm font-medium hover:bg-accent hover:text-ink transition-all disabled:opacity-40">
          {loading ? 'Saving...' : initial?.id ? 'Update project' : 'Add project'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-3 border border-border rounded-full text-sm hover:bg-paper transition-all">
          Cancel
        </button>
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

function ReviewForm({ projects, onSaved, onCancel }: {
  projects: Project[]
  onSaved: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({ ...blankReview })
  const [loading, setLoading] = useState(false)

  function set(field: string, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

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
        <Field label="Client name" required>
          <input required value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Priya Mehta" className="input" />
        </Field>
        <Field label="Client role">
          <input value={form.clientRole} onChange={e => set('clientRole', e.target.value)} placeholder="Founder, StartupXYZ" className="input" />
        </Field>
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
            <button
              key={n}
              type="button"
              onClick={() => set('rating', n)}
              className={`w-9 h-9 rounded-full text-sm border transition-all ${
                form.rating >= n ? 'bg-ink text-paper border-ink' : 'border-border text-muted'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Review text (full)">
        <textarea required value={form.text} onChange={e => set('text', e.target.value)} rows={4} placeholder="Working with [name] was..." className="input resize-none" />
      </Field>

      <Field label="Highlight quote (one-liner for hero display)">
        <input required value={form.highlight} onChange={e => set('highlight', e.target.value)} placeholder="Best developer I've worked with." className="input" />
      </Field>

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
        <Field label="Photo URL (optional)">
          <input value={form.clientPhoto} onChange={e => set('clientPhoto', e.target.value)} placeholder="https://..." className="input" />
        </Field>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="verified" checked={form.verified} onChange={e => set('verified', e.target.checked)} className="w-4 h-4 accent-ink" />
        <label htmlFor="verified" className="text-sm">Mark as verified</label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="flex-1 bg-ink text-paper py-3 rounded-full text-sm font-medium hover:bg-accent hover:text-ink transition-all disabled:opacity-40">
          {loading ? 'Saving...' : 'Add review'}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-3 border border-border rounded-full text-sm hover:bg-paper transition-all">
          Cancel
        </button>
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

// ─── Main admin page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<'projects' | 'reviews'>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)

  async function load() {
    const [p, r] = await Promise.all([getProjects(), getReviews()])
    setProjects(p)
    setReviews(r)
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

  return (
    <div className="min-h-screen bg-paper">
      <style>{`.input { width: 100%; border: 1px solid #E2DDD4; border-radius: 12px; padding: 10px 14px; font-size: 14px; background: white; outline: none; transition: border-color 0.15s; } .input:focus { border-color: #0D0D0D; }`}</style>

      {/* Header */}
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
          {(['projects', 'reviews'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`capitalize text-sm px-5 py-2 rounded-full transition-all ${
                tab === t ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
              }`}
            >
              {t} ({t === 'projects' ? projects.length : reviews.length})
            </button>
          ))}
        </div>

        {/* ── Projects tab ── */}
        {tab === 'projects' && (
          <div>
            {!showProjectForm && !editProject && (
              <button
                onClick={() => setShowProjectForm(true)}
                className="mb-6 bg-ink text-paper px-6 py-3 rounded-full text-sm font-medium hover:bg-accent hover:text-ink transition-all"
              >
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
                  {p.screenshotUrl && (
                    <img src={p.screenshotUrl} alt="" className="w-28 h-16 rounded-xl object-cover object-top flex-shrink-0 border border-border" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{p.title}</h3>
                      {p.featured && <span className="text-xs bg-accent/20 text-ink px-2 py-0.5 rounded-full">Featured</span>}
                      <span className="text-xs border border-border px-2 py-0.5 rounded-full text-muted capitalize">{p.category}</span>
                    </div>
                    <p className="text-xs text-muted">{p.clientName} · {p.outcome}</p>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {p.techStack.slice(0, 4).map(t => (
                        <span key={t} className="text-xs bg-paper px-2 py-0.5 rounded-full text-muted">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setEditProject(p)} className="text-xs border border-border px-3 py-1.5 rounded-full hover:bg-paper transition-all">Edit</button>
                    <button
                      onClick={async () => { if (confirm(`Delete "${p.title}"?`)) { await deleteProject(p.id); load() } }}
                      className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-full hover:bg-red-50 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {projects.length === 0 && !showProjectForm && (
                <p className="text-center text-muted py-12">No projects yet. Add your first one!</p>
              )}
            </div>
          </div>
        )}

        {/* ── Reviews tab ── */}
        {tab === 'reviews' && (
          <div>
            {!showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="mb-6 bg-ink text-paper px-6 py-3 rounded-full text-sm font-medium hover:bg-accent hover:text-ink transition-all"
              >
                + Add review
              </button>
            )}

            {showReviewForm && (
              <div className="bg-white border border-border rounded-2xl p-8 mb-8">
                <h2 className="font-display text-2xl mb-6">New review</h2>
                <ReviewForm
                  projects={projects}
                  onSaved={() => { load(); setShowReviewForm(false) }}
                  onCancel={() => setShowReviewForm(false)}
                />
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
                  <button
                    onClick={async () => { if (confirm(`Delete review from ${r.clientName}?`)) { await deleteReview(r.id); load() } }}
                    className="text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-full hover:bg-red-50 transition-all flex-shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {reviews.length === 0 && !showReviewForm && (
                <p className="text-center text-muted py-12">No reviews yet. Add your first one!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
