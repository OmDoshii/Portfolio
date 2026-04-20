const services = [
  {
    title: 'Business Website',
    description: 'Fast, SEO-optimised website that represents your brand and converts visitors.',
    includes: [
      'Up to 6 pages',
      'Responsive design',
      'Contact form',
      'Basic SEO setup',
      'Google Analytics',
      '1 month support',
    ],
    startingPrice: 15000,
    deliveryDays: 14,
    popular: false,
  },
  {
    title: 'SaaS / Web App',
    description: 'Full-stack product with auth, database, dashboard, and all the plumbing you need.',
    includes: [
      'Custom UI design',
      'User authentication',
      'Firestore / Postgres DB',
      'Payment integration',
      'Admin dashboard',
      '3 months support',
    ],
    startingPrice: 50000,
    deliveryDays: 30,
    popular: true,
  },
  {
    title: 'MVP Package',
    description: 'Validate your idea fast. Core features only — launch in 3 weeks.',
    includes: [
      'Scoped to 3 core features',
      'Working prototype',
      'Deploy to production',
      'User feedback loop',
      'Iteration round',
      '1 month support',
    ],
    startingPrice: 25000,
    deliveryDays: 21,
    popular: false,
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 max-w-6xl mx-auto">
      <div className="mb-12">
        <p className="text-sm font-mono text-muted uppercase tracking-widest mb-3">What I offer</p>
        <h2 className="font-display text-5xl md:text-6xl">
          Services &
          <br />
          <span className="italic text-muted">pricing.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {services.map(service => (
          <div
            key={service.title}
            className={`relative rounded-2xl p-8 border transition-all duration-200 ${
              service.popular
                ? 'bg-ink text-paper border-ink'
                : 'bg-card border-border hover:border-ink/30'
            }`}
          >
            {service.popular && (
              <div className="absolute -top-3 left-8">
                <span className="bg-accent text-ink text-xs font-medium px-3 py-1 rounded-full">
                  Most popular
                </span>
              </div>
            )}

            <h3 className="font-display text-2xl mb-2">{service.title}</h3>
            <p className={`text-sm leading-relaxed mb-6 ${service.popular ? 'text-white/60' : 'text-muted'}`}>
              {service.description}
            </p>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className={`text-xs ${service.popular ? 'text-white/40' : 'text-muted'}`}>Starting at</span>
              </div>
              <div className="font-display text-4xl">
                ₹{service.startingPrice.toLocaleString('en-IN')}
              </div>
              <div className={`text-xs mt-1 ${service.popular ? 'text-white/40' : 'text-muted'}`}>
                Delivered in ~{service.deliveryDays} days
              </div>
            </div>

            <ul className="space-y-2.5 mb-8">
              {service.includes.map(item => (
                <li key={item} className={`flex items-center gap-2.5 text-sm ${service.popular ? 'text-white/80' : 'text-muted'}`}>
                  <svg className={`w-4 h-4 flex-shrink-0 ${service.popular ? 'text-accent' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className={`block text-center text-sm font-medium py-3 rounded-full transition-all duration-200 ${
                service.popular
                  ? 'bg-accent text-ink hover:bg-white hover:text-ink'
                  : 'bg-ink text-paper hover:bg-accent hover:text-ink'
              }`}
            >
              Get started →
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
