import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon%204-1scOO5uRlzgf2A0EBzgB8NYQmENW9t.png"
                alt="IDELEH Logo"
                width={150}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Leading the Future - Ideal Leadership Hub is dedicated to empowering the next generation of leaders
              through innovative programs and events.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-primary dark:text-gray-400">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary dark:text-gray-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary dark:text-gray-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-primary dark:text-gray-400">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-600 hover:text-primary dark:text-gray-400">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-600 hover:text-primary dark:text-gray-400">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-600 hover:text-primary dark:text-gray-400">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-600 hover:text-primary dark:text-gray-400">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary dark:text-gray-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Abuja:</strong> 1473 Innerblock street Central Business District, Abuja.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>Jos:</strong> Greatworks complex Genesis Plaza, Latiya Rayfield.
                  </p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-gray-600 dark:text-gray-400">07048588048</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-gray-600 dark:text-gray-400">idealeadhub@gmail.com</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subscribe</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Subscribe to our newsletter to receive updates on our latest events and programs.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800"
                required
              />
              <button
                type="submit"
                className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} IDELEH - Ideal Leadership Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
