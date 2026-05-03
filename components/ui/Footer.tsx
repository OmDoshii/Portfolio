export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p className="font-display text-lg text-ink">
          Oriange<span className="text-accent">.</span>
        </p>
        <p>Built with Next.js · Hosted on Vercel · © {new Date().getFullYear()}</p>
        <div className="flex gap-6 items-center">
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">GitHub</a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">LinkedIn</a>
          <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">Twitter</a>
          <span className="text-border select-none">|</span>
          <a href="/admin" className="hover:text-ink transition-colors">Admin</a>
          <a href="/client" className="hover:text-ink transition-colors">Client</a>
        </div>
      </div>
    </footer>
  )
}
