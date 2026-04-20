import { getProjects } from '@/lib/db'
import { getReviews } from '@/lib/db'
import Hero from '@/components/sections/Hero'
import Stats from '@/components/sections/Stats'
import Projects from '@/components/sections/Projects'
import Reviews from '@/components/sections/Reviews'
import Services from '@/components/sections/Services'
import TechStack from '@/components/sections/TechStack'
import Process from '@/components/sections/Process'
import Contact from '@/components/sections/Contact'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export const revalidate = 3600 // ISR: rebuild every hour

export default async function Home() {
  const [projects, reviews] = await Promise.all([
    getProjects(),
    getReviews(),
  ])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Projects projects={projects} />
        <Reviews reviews={reviews} />
        <Services />
        <TechStack />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
