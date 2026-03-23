import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Phone, Lightbulb, Users, Building2, ArrowRight } from "lucide-react"
import { api } from "@/lib/api"
import { getImageSrc } from "@/lib/image-utils"
import { HeroSlideshow } from "@/components/hero-slideshow"
import { ScrollReveal, FadeIn } from "@/components/scroll-reveal"

async function getHeroImages() {
  try {
    return await api.hero.getAll()
  } catch (e) {
    console.error("Failed to fetch hero images:", e)
    return []
  }
}

export default async function Home() {
  let events = []
  let featuredProjects = []
  let teamMembers = []
  let galleryImages = []
  let siteContent = {
    mission: { title: "Our Mission", content: "To identify and raise credible, competent, and principled leaders." },
    vision: { title: "Our Vision", content: "High performing Leaders providing the nations with genuine leadership." }
  }

  try {
    [events, featuredProjects, teamMembers, galleryImages] = await Promise.all([
      api.events.getAll().catch(() => []),
      api.projects.getAll().catch(() => []),
      api.team.getAll().catch(() => []),
      api.gallery.getAll().catch(() => []),
    ])

    const [mission, vision] = await Promise.all([
      api.content.get("mission").catch(() => null),
      api.content.get("vision").catch(() => null),
    ])

    if (mission) siteContent.mission = mission
    if (vision) siteContent.vision = vision
  } catch (error) {
    console.error("Failed to fetch home data:", error)
  }

  const heroImages = (await getHeroImages()) || []
  const displayHeroImages = heroImages.length > 0 ? heroImages.map((h: any) => ({
    id: h.id,
    title: h.title,
    description: h.description,
    imageUrl: getImageSrc(h.image_data),
    ctaText: "Join Us",
    ctaLink: "/events"
  })) : [
    { id: "1", title: "IDEAL LEADERSHIP HUB", description: "Empowering the next generation of leaders through strategic trainings and mentorship.", imageUrl: "/placeholder.svg?height=1080&width=1920", ctaText: "Join Us", ctaLink: "/events" }
  ]

  let purposeImageSrc = "/images/purpose.jpg"
  if (galleryImages[0] && galleryImages[0].image_data) {
    const src = getImageSrc(galleryImages[0].image_data)
    if (src !== "/placeholder.svg" && !src.toLowerCase().endsWith('.heic')) {
      purposeImageSrc = src
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSlideshow images={displayHeroImages} />

      {/* Vision & Mission Section */}
      <section className="py-32 relative overflow-hidden bg-background">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2 blur-2xl opacity-50 dark:opacity-20 pointer-events-none" />
        <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] pointer-events-none opacity-50" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div>
              <ScrollReveal>
                <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Our Purpose</span>
                <h2 className="text-4xl md:text-6xl font-display mb-8 text-foreground leading-tight">
                  Raising <span className="text-primary italic">Credible Leaders</span> for Global Impact
                </h2>
              </ScrollReveal>

              <div className="space-y-6">
                <ScrollReveal delay={0.2}>
                  <div className="glass-card p-8 rounded-2xl hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <h3 className="text-2xl font-display font-bold mb-4 flex items-center gap-3 relative z-10 text-foreground">
                      <div className="w-1.5 h-6 bg-secondary rounded-full" />
                      {siteContent.vision.title}
                    </h3>
                    <p className="text-lg text-foreground/80 leading-relaxed relative z-10">{siteContent.vision.content}</p>
                  </div>
                </ScrollReveal>

                <ScrollReveal delay={0.3}>
                  <div className="glass-card p-8 rounded-2xl hover:scale-[1.02] transition-transform duration-500 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-secondary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <h3 className="text-2xl font-display font-bold mb-4 flex items-center gap-3 relative z-10 text-foreground">
                      <div className="w-1.5 h-6 bg-primary rounded-full" />
                      {siteContent.mission.title}
                    </h3>
                    <p className="text-lg text-foreground/80 leading-relaxed relative z-10">{siteContent.mission.content}</p>
                  </div>
                </ScrollReveal>
              </div>

              <ScrollReveal delay={0.4}>
                <div className="mt-12 flex gap-4">
                  <Button asChild size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-primary/30 transition-all">
                    <Link href="/about">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </ScrollReveal>
            </div>

            <FadeIn delay={0.3}>
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5 rounded-[2rem] rotate-3 scale-105" />
                <div className="relative h-[650px] overflow-hidden rounded-[2rem] shadow-2xl border border-white/20 dark:border-white/10 bg-card">
                  <img src={purposeImageSrc} alt="IDELEH Impact" className="object-cover w-full h-full" />
                </div>
                <div className="absolute -bottom-8 -left-8 glass-card border border-white/20 dark:border-white/10 p-6 rounded-2xl shadow-xl max-w-[220px] animate-bounce" style={{ animationDuration: '4s' }}>
                  <p className="text-4xl font-display font-bold text-primary mb-1">1000+</p>
                  <p className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Leaders Trained</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-secondary/5 py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="mb-24 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-display mb-6 text-foreground">Our <span className="text-secondary italic bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">Core Services</span></h2>
              <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary mx-auto mb-8 rounded-full" />
              <p className="text-xl text-foreground/70">We provide a comprehensive framework for leadership development that spans across different sectors and age groups.</p>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Lightbulb, title: "Trainings", desc: "Interactive workshops and real-world case studies to enhance leadership capabilities." },
              { icon: Users, title: "Mentorship", desc: "Pairing young leaders with experienced mentors for guidance and industry insights." },
              { icon: Building2, title: "Corporate Consultation", desc: "Expert advice on organizational leadership challenges and culture building." }
            ].map((service, i) => (
              <ScrollReveal delay={i * 0.15} key={i}>
                <div className="group glass-card p-10 rounded-3xl hover:border-primary/30 transition-all duration-500 h-full flex flex-col hover:-translate-y-2">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-background shadow-md shadow-primary/10 group-hover:scale-110 transition-transform duration-500">
                    <service.icon className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="mb-4 text-2xl font-display font-bold text-foreground">{service.title}</h3>
                  <p className="text-foreground/70 leading-relaxed mb-8 flex-grow">{service.desc}</p>
                  <Button asChild variant="ghost" className="p-0 hover:bg-transparent text-primary hover:text-primary/70 self-start">
                    <Link href="/services" className="flex items-center gap-2 group-hover:gap-3 transition-all">Explore Service <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-32 relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-display mb-6 text-foreground">Signature <span className="text-primary italic">Projects</span></h2>
                <p className="text-xl text-foreground/70">Transformative initiatives that define our commitment to national development.</p>
              </div>
              <Button asChild variant="outline" size="lg" className="rounded-full border-primary/20 hover:bg-primary/5">
                <Link href="/projects">View All Projects</Link>
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.length > 0 ? featuredProjects.map((project: any, i: number) => (
              <ScrollReveal delay={i * 0.15} key={project.id}>
                <div className="group flex flex-col h-full bg-card overflow-hidden rounded-3xl shadow-lg border border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-72 w-full overflow-hidden">
                    <Image
                      src={
                        project.image_data && getImageSrc(project.image_data) !== "/placeholder.svg"
                          ? getImageSrc(project.image_data)
                          : (
                            project.title === "LeaderZ Conferences" ? "/images/leaderz.jpg" :
                              project.title === "Nation Building Conferences" ? "/images/nbc.jpg" :
                                project.title === "Mentorship Hub" ? "/images/mentorship.jpg" :
                                  "/placeholder.svg"
                          )
                      }
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="flex flex-col flex-grow p-10 relative">
                    <h3 className="text-2xl font-display font-bold text-foreground mb-4">{project.title}</h3>
                    <p className="text-foreground/70 line-clamp-3 mb-8 flex-grow leading-relaxed">{project.description}</p>
                    <Link href="/projects" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all mt-auto uppercase tracking-wider text-sm">Read Case Study <ArrowRight className="h-4 w-4" /></Link>
                  </div>
                </div>
              </ScrollReveal>
            )) : [
              { title: "LeaderZ Conferences", desc: "The LeaderZ Conference aims to redefine the way secondary school prefects are trained, mentored, and empowered.", img: "/images/leaderz.jpg" },
              { title: "Nation Building Conferences", desc: "Designed to inspire aspiring leaders to position themselves with the requisite knowledge and values required to address national challenges.", img: "/images/nbc.jpg" },
              { title: "Mentorship Hub", desc: "A transformative learning experience empowering mentors and mentees.", img: "/images/mentorship.jpg" }
            ].map((p, i) => (
              <ScrollReveal delay={i * 0.15} key={i}>
                <div className="group flex flex-col h-full bg-card overflow-hidden rounded-3xl shadow-lg border border-border hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-72 w-full overflow-hidden bg-muted">
                    <Image src={p.img} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="flex flex-col flex-grow p-10 relative">
                    <h3 className="text-2xl font-display font-bold text-foreground mb-4">{p.title}</h3>
                    <p className="text-foreground/70 line-clamp-3 mb-8 flex-grow leading-relaxed">{p.desc}</p>
                    <Link href="/projects" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all mt-auto uppercase tracking-wider text-sm">Read Case Study <ArrowRight className="h-4 w-4" /></Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-primary/5 py-32 relative">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-secondary/10 blur-[150px] pointer-events-none opacity-40" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <ScrollReveal>
            <div className="mb-24">
              <h2 className="text-4xl md:text-6xl font-display mb-6 text-foreground">Our <span className="text-secondary italic">Leadership</span></h2>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto">Guided by a team of visionary leaders dedicated to the Hub's mission.</p>
            </div>
          </ScrollReveal>

          <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.length > 0 ? teamMembers.map((member: any, i: number) => (
              <ScrollReveal delay={i * 0.15} key={member.id}>
                <div className="group flex flex-col items-center">
                  <div className="relative h-80 w-80 mb-8 overflow-hidden rounded-full border-4 border-background shadow-2xl transition-transform duration-700 group-hover:scale-[1.03]">
                    <Image src={getImageSrc(member.image_data) || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-2">{member.name}</h3>
                  <p className="text-secondary font-bold uppercase tracking-widest text-sm mb-4">{member.position}</p>
                  <div className="max-w-sm">
                    <p className="text-foreground/60 leading-relaxed line-clamp-2">{member.bio}</p>
                  </div>
                </div>
              </ScrollReveal>
            )) : [
              { name: "Abel Ajayi", role: "Co-Founder" },
              { name: "Priscilla Asher John", role: "Executive Director" },
              { name: "Waltong David Tyoden", role: "Co-Founder" }
            ].map((m, i) => (
              <ScrollReveal delay={i * 0.15} key={i}>
                <div className="flex flex-col items-center opacity-70">
                  <div className="h-80 w-80 bg-muted rounded-full mb-8 shadow-inner" />
                  <h3 className="text-2xl font-display font-bold mb-2">{m.name}</h3>
                  <p className="text-primary text-sm font-bold uppercase tracking-widest">{m.role}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.4}>
            <div className="mt-20">
              <Button asChild size="lg" className="rounded-full px-10 font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg">
                <Link href="/team">Meet Full Team</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>


    </div>
  )
}
