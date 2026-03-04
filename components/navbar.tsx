"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Our Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false) }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "glass shadow-sm dark:glass-dark"
          : "bg-white/60 backdrop-blur-md dark:bg-gray-950/60",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon%204-1scOO5uRlzgf2A0EBzgB8NYQmENW9t.png"
              alt="IDELEH Logo"
              width={130}
              height={70}
              className="h-14 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "nav-link px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                  pathname === link.href
                    ? "text-primary active"
                    : "text-foreground/70 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="sm" className="ml-4 rounded-full px-5 font-semibold shadow-sm">
              <Link href="/events">Register</Link>
            </Button>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="flex md:hidden items-center justify-center w-9 h-9 rounded-full text-foreground/70 hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-md">
          <nav className="container mx-auto flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-2 rounded-full font-semibold">
              <Link href="/events">Register for Events</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
