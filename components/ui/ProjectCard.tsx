import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/types'

const categoryColors: Record<string, string> = {
  website: 'bg-blue-50 text-blue-700',
  app: 'bg-purple-50 text-purple-700',
  saas: 'bg-accent/20 text-ink',
  other: 'bg-gray-100 text-gray-700',
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card group bg-card border border-border rounded-2xl overflow-hidden hover:border-ink/30 transition-all duration-300">
      {/* Screenshot — clickable, opens client site */}
      <a
        href={project.clientUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative overflow-hidden aspect-[16/9] bg-paper"
        aria-label={`Visit ${project.clientName}'s website`}
      >
        {project.screenshotUrl ? (
          <Image
            src={project.screenshotUrl}
            alt={`Screenshot of ${project.clientName}`}
            fill
            className="card-screenshot object-cover object-top"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-sm">
            No screenshot yet
          </div>
        )}

        {/* Hover overlay with "visit site" CTA */}
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-all duration-300 flex items-center justify-center">
          <span className="text-paper text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-ink/80 px-4 py-2 rounded-full backdrop-blur-sm">
            Visit site ↗
          </span>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize backdrop-blur-sm ${categoryColors[project.category]}`}>
            {project.category}
          </span>
        </div>
      </a>

      {/* Card body */}
      <div className="p-6">
        {/* Client + title */}
        <div className="mb-3">
          <p className="text-xs text-muted font-mono uppercase tracking-widest mb-1">
            {project.clientName} · {project.industry}
          </p>
          <h3 className="font-display text-2xl leading-tight">{project.title}</h3>
        </div>

        {/* Problem → Solution → Outcome */}
        <div className="space-y-2 mb-4 text-sm text-muted">
          <p><span className="text-ink font-medium">Problem: </span>{project.problem}</p>
          <p><span className="text-ink font-medium">Solution: </span>{project.solution}</p>
        </div>

        {/* Outcome pill */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 bg-accent/20 text-ink text-xs font-medium px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {project.outcome}
          </span>
        </div>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.map(tech => (
            <span
              key={tech}
              className="text-xs border border-border px-2.5 py-1 rounded-full text-muted font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <a
            href={project.clientUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm font-medium bg-ink text-paper py-2.5 rounded-full hover:bg-accent hover:text-ink transition-all duration-200"
          >
            Live demo ↗
          </a>
          {project.caseStudyUrl && (
            <Link
              href={project.caseStudyUrl}
              className="flex-1 text-center text-sm font-medium border border-ink py-2.5 rounded-full hover:bg-ink hover:text-paper transition-all duration-200"
            >
              Case study →
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
