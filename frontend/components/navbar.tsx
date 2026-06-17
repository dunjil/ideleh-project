"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { href: "/", label: "Home" },
  {
    label: "About",
    items: [
      { href: "/about", label: "About Us" },
      { href: "/team", label: "Our Team" },
      { href: "/services", label: "Services" },
    ]
  },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
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
        "sticky top-0 z-50 w-full transition-all duration-500 px-0 sm:px-4",
        isScrolled ? "py-4" : "py-0"
      )}
    >
      <div className={cn(
        "mx-auto max-w-7xl transition-all duration-500",
        isScrolled
          ? "glass-card rounded-2xl sm:rounded-full px-6 shadow-xl border border-white/20 dark:border-white/10"
          : "bg-background/90 backdrop-blur-xl border-b border-border/50 px-4 sm:px-6 shadow-sm"
      )}>
        <div className={cn(
          "flex items-center justify-between transition-all duration-500",
          isScrolled ? "h-16" : "h-24"
        )}>
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 shrink-0 group">
            <div className={cn("relative transition-all duration-500", isScrolled ? "h-12 w-32" : "h-16 w-40")}>
              <Image
                src="/ideal_logo.png"
                alt="IDELEH Logo"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-0.5 lg:gap-1">
            {navLinks.map((link) => {
              // Check if this is a dropdown menu
              if ('items' in link && link.items) {
                const isActive = link.items.some(item => pathname === item.href)
                return (
                  <DropdownMenu key={link.label}>
                    <DropdownMenuTrigger className={cn(
                      "nav-link px-2 lg:px-4 py-2 text-xs lg:text-sm font-bold uppercase tracking-wider rounded-full transition-all duration-300 relative group overflow-hidden flex items-center gap-1",
                      isActive
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    )}>
                      <span className="relative z-10">{link.label}</span>
                      <ChevronDown className="h-3 w-3 relative z-10" />
                      {isActive && (
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/50 mx-4" />
                      )}
                      <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[180px] glass-card border-border/50">
                      {link.items.map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "w-full cursor-pointer font-medium",
                              pathname === item.href && "text-primary bg-primary/10"
                            )}
                          >
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }

              // Regular link
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "nav-link px-2 lg:px-4 py-2 text-xs lg:text-sm font-bold uppercase tracking-wider rounded-full transition-all duration-300 relative group overflow-hidden",
                    pathname === link.href
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  <div className="relative z-10">{link.label}</div>
                  {pathname === link.href && (
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/50 mx-4" />
                  )}
                  <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
                </Link>
              )
            })}
            <Button asChild size="sm" className="ml-2 lg:ml-4 rounded-full px-4 lg:px-6 font-bold shadow-md hover:shadow-primary/30 bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105">
              <Link href="/support">Support Us</Link>
            </Button>
            <div className="ml-1 lg:ml-2">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full text-foreground/70 hover:bg-muted hover:text-foreground transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 right-0 overflow-hidden transition-all duration-300 ease-in-out shadow-2xl glass-card border-t border-border/50",
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container mx-auto flex flex-col px-6 py-6 gap-2">
          {navLinks.map((link) => {
            // Check if this is a dropdown section
            if ('items' in link && link.items) {
              const isActive = link.items.some(item => pathname === item.href)
              return (
                <div key={link.label} className="flex flex-col gap-1">
                  <div className={cn(
                    "px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground/50"
                  )}>
                    {link.label}
                  </div>
                  {link.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "px-4 py-3 pl-8 rounded-xl text-sm font-medium transition-all",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:bg-muted/50 hover:text-foreground hover:translate-x-1"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )
            }

            // Regular link
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:bg-muted/50 hover:text-foreground hover:translate-x-1"
                )}
              >
                {link.label}
              </Link>
            )
          })}
          <Button asChild className="mt-4 rounded-xl py-6 font-bold shadow-md bg-primary text-primary-foreground hover:bg-primary/90 w-full text-lg">
            <Link href="/support">Support Us</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
