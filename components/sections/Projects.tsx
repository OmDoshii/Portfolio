'use client'
import { useState } from 'react'
import ProjectCard from '@/components/ui/ProjectCard'
import type { Project } from '@/types'

const filters = ['all', 'website', 'app', 'saas'] as const
type Filter = typeof filters[number]

export default function Projects({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Filter>('all')

  const filtered = active === 'all'
    ? projects
    : projects.filter(p => p.category === active)

  return (
    <section id="work" className="py-24 px-6 max-w-6xl mx-auto">
      {/* Heading */}
      <div className="mb-12">
        <p className="text-sm font-mono text-muted uppercase tracking-widest mb-3">Selected work</p>
        <h2 className="font-display text-5xl md:text-6xl">
          Projects that
          <br />
          <span className="italic text-muted">actually shipped.</span>
        </h2>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 mb-10 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`capitalize text-sm px-4 py-2 rounded-full border transition-all duration-200 ${
              active === f
                ? 'bg-ink text-paper border-ink'
                : 'border-border text-muted hover:border-ink/40 hover:text-ink'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-muted">
          <p className="font-display text-3xl mb-2">Nothing here yet.</p>
          <p className="text-sm">Add projects from the admin panel.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}
