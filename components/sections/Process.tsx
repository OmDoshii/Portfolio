const steps = [
  {
    number: '01',
    title: 'Discovery call',
    description: 'We talk through your idea, goals, and constraints. I ask the right questions to scope the project accurately.',
    duration: '1–2 days',
  },
  {
    number: '02',
    title: 'Proposal & quote',
    description: 'You receive a clear breakdown: what I\'ll build, what it costs, and exactly when it\'ll be delivered.',
    duration: '1 day',
  },
  {
    number: '03',
    title: 'Design & build',
    description: 'I work in sprints with regular check-ins. You see progress weekly, not just at the end.',
    duration: 'Varies',
  },
  {
    number: '04',
    title: 'Review & refine',
    description: 'Two rounds of revisions are included. Your feedback shapes the final product.',
    duration: '3–5 days',
  },
  {
    number: '05',
    title: 'Deploy & handoff',
    description: 'I deploy to production, hand over all credentials and code, and walk you through everything.',
    duration: '1 day',
  },
  {
    number: '06',
    title: 'Support',
    description: 'Post-launch support period included. Bugs get fixed fast, no questions asked.',
    duration: '1–3 months',
  },
]

export default function Process() {
  return (
    <section id="process" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <p className="text-sm font-mono text-muted uppercase tracking-widest mb-3">How I work</p>
        <h2 className="font-display text-5xl md:text-6xl">
          No surprises,
          <br />
          <span className="italic text-muted">just results.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map(step => (
          <div
            key={step.number}
            className="group p-6 border border-border rounded-2xl hover:border-ink/30 hover:bg-white transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="font-mono text-4xl font-medium text-border group-hover:text-accent transition-colors duration-200">
                {step.number}
              </span>
              <span className="text-xs font-mono text-muted bg-paper px-2.5 py-1 rounded-full">
                {step.duration}
              </span>
            </div>
            <h3 className="font-display text-xl mb-2">{step.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
