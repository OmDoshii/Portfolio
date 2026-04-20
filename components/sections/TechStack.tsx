const stack = [
  { category: 'Frontend', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
  { category: 'Backend', items: ['Node.js', 'Firebase', 'Supabase', 'REST APIs', 'GraphQL'] },
  { category: 'Mobile', items: ['React Native', 'Expo'] },
  { category: 'Tools', items: ['Git', 'Vercel', 'Figma', 'Postman', 'VS Code'] },
]

export default function TechStack() {
  return (
    <section id="stack" className="py-24 px-6 bg-white border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-sm font-mono text-muted uppercase tracking-widest mb-3">Tools of the trade</p>
          <h2 className="font-display text-5xl md:text-6xl">
            Tech
            <br />
            <span className="italic text-muted">stack.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stack.map(group => (
            <div key={group.category}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-muted mb-4 pb-2 border-b border-border">
                {group.category}
              </h3>
              <ul className="space-y-2">
                {group.items.map(item => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm font-medium hover:translate-x-1 transition-transform duration-150 cursor-default"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
