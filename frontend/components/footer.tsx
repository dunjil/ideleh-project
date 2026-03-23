import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { Button } from "./ui/button"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border relative overflow-hidden">
      {/* Decorative Top Border Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      {/* Decorative Bottom Mesh Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-t-full blur-[100px] pointer-events-none translate-y-1/2" />

      <div className="container mx-auto px-4 py-20 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">

          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="inline-block group">
              <div className="relative h-20 w-48 transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/ideal_logo.png"
                  alt="IDELEH Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-foreground/70 leading-relaxed max-w-xs">
              Leading the Future. We are dedicated to empowering the next generation of leaders through innovative programs, deep mentorship, and strategic events.
            </p>
            <div className="flex space-x-5">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" }
              ].map((Social, i) => (
                <Link key={i} href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1 shadow-sm">
                  <Social.icon className="h-4 w-4" />
                  <span className="sr-only">{Social.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h3 className="text-xl font-display font-bold text-foreground">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Services", href: "/services" },
                { name: "Projects", href: "/projects" },
                { name: "Events", href: "/events" },
                { name: "Our Team", href: "/team" },
                { name: "Gallery", href: "/gallery" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-foreground/70 hover:text-primary transition-colors flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-xl font-display font-bold text-foreground">Contact Us</h3>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4 group">
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-1">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-foreground/80 leading-relaxed">
                    <strong className="text-foreground">Abuja:</strong> 1473 Innerblock street CBD, Abuja.
                  </p>
                  <p className="text-foreground/80 leading-relaxed mt-2">
                    <strong className="text-foreground">Jos:</strong> Greatworks complex Genesis Plaza, Latiya.
                  </p>
                </div>
              </li>
              <li className="flex items-center space-x-4 group">
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-foreground/80 font-medium">07048588048</span>
              </li>
              <li className="flex items-center space-x-4 group">
                <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-foreground/80 font-medium">idealeadhub@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-20 border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/60 font-medium">
            © {new Date().getFullYear()} IDELEH - Ideal Leadership Hub. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
