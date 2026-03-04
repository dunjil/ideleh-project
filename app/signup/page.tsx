import { SignUpForm } from "@/components/auth/signup-form"
import Image from "next/image"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen">
      {/* Right decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 order-last relative bg-gradient-to-bl from-secondary via-secondary/80 to-primary items-center justify-center p-12">
        <div className="relative z-10 text-white text-center">
          <p className="text-xl font-light leading-relaxed opacity-90">
            &ldquo;To raise Credible, Competent and Principled drivers of Effective and Progressive leadership.&rdquo;
          </p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest opacity-70">Join the Movement</p>
        </div>
        <div className="absolute top-16 right-16 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-24 left-12 w-48 h-48 rounded-full bg-primary/20 blur-3xl" />
      </div>

      {/* Left form panel */}
      <div className="flex w-full lg:w-1/2 xl:w-3/5 flex-col items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md animate-fade-in-up">
          <Link href="/" className="mb-10 flex justify-center">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon%204-1scOO5uRlzgf2A0EBzgB8NYQmENW9t.png"
              alt="IDELEH Logo"
              width={120}
              height={60}
              className="h-14 w-auto"
            />
          </Link>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Join the IDELEH community today</p>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm card-shadow">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  )
}
