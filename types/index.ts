export interface Project {
  id: string
  title: string
  clientName: string
  clientUrl: string
  screenshotUrl: string
  description: string
  problem: string          // What problem did the client have?
  solution: string         // What did you build?
  outcome: string          // Result / metric e.g. "Launched in 3 weeks"
  techStack: string[]
  category: 'website' | 'app' | 'saas' | 'other'
  industry: string         // e.g. "E-commerce", "Healthcare"
  featured: boolean
  caseStudyUrl?: string    // optional deep-dive page
  completedAt: string      // ISO date string
  createdAt: string
}

export interface Review {
  id: string
  clientName: string
  clientRole: string       // e.g. "Founder, TechStartup"
  clientCompany: string
  clientPhoto?: string     // URL or initials fallback
  projectId: string        // links to a Project
  rating: number           // 1-5
  text: string
  highlight: string        // One-liner pulled quote for hero display
  platform: 'direct' | 'linkedin' | 'fiverr' | 'upwork' | 'other'
  verified: boolean
  createdAt: string
}

export interface Stat {
  id: string
  label: string
  value: number
  suffix?: string          // e.g. "+" or "%"
  icon: string             // lucide icon name
}

export interface Service {
  id: string
  title: string
  description: string
  includes: string[]
  startingPrice: number    // in INR
  deliveryDays: number
  popular: boolean
}
