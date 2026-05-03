'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useClientAuth } from './auth-context'
import { getClient } from '@/lib/db'

export default function ClientLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useClientAuth()
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const clientData = await getClient(username.trim())

      if (!clientData || clientData.password !== password) {
        setError('Invalid username or password.')
        return
      }

      login({
        username: username.trim(),
        businessName: clientData.businessName,
        service: clientData.service,
      })

      router.push('/client/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="font-display text-2xl text-ink inline-block">
            Oriange<span className="text-accent">.</span>
          </a>
          <h1 className="mt-4 text-3xl font-display text-ink">Client Portal</h1>
          <p className="mt-2 text-muted text-sm">Sign in to access your dashboard</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                autoComplete="username"
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm text-ink bg-paper focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white font-medium py-2.5 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          <a href="/" className="hover:text-ink transition-colors">
            ← Back to website
          </a>
          {' · '}
          Having trouble?{' '}
          <a href="/#contact" className="hover:text-ink transition-colors underline underline-offset-2">
            Contact us
          </a>
        </p>
      </div>
    </div>
  )
}
