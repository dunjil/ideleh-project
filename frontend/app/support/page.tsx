import { Building2, CreditCard, User, Phone, Mail, Heart } from "lucide-react"
import { api } from "@/lib/api"
import { CopyButton } from "@/components/copy-button"

interface SupportInfo {
  bank_name?: string
  account_name?: string
  account_number?: string
  phone?: string
  email?: string
  message?: string
}

async function getSupportInfo(): Promise<SupportInfo> {
  try {
    const data = await api.supportInfo.get()
    return data || {}
  } catch (error) {
    console.error("Failed to fetch support info:", error)
    return {}
  }
}

export default async function SupportPage() {
  const supportInfo = await getSupportInfo()

  // Fallback support data
  const support = {
    bank_name: supportInfo.bank_name || "First Bank of Nigeria",
    account_name: supportInfo.account_name || "Ideal Leadership Hub",
    account_number: supportInfo.account_number || "1234567890",
    phone: supportInfo.phone || "07048588048",
    email: supportInfo.email || "idealeadhub@gmail.com",
    message: supportInfo.message || "Your support helps us empower the next generation of leaders. Every contribution makes a difference in developing credible, competent, and principled leaders for our nation.",
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
            <Heart className="h-10 w-10" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground mb-4">
            Support <span className="text-primary italic">Our Mission</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join us in empowering the next generation of leaders. Your contribution helps us create lasting impact.
          </p>
        </div>

        {/* Message Section */}
        {support.message && (
          <div className="glass-card p-8 rounded-3xl mb-12 bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-center"
              dangerouslySetInnerHTML={{ __html: support.message }}
            />
          </div>
        )}

        {/* Bank Details Card */}
        <div className="glass-card p-10 rounded-3xl mb-8 border-2 border-primary/20">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-border">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Bank Account Details</h2>
          </div>

          <div className="space-y-6">
            {/* Bank Name */}
            <div className="group">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Bank Name
              </label>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="text-lg font-bold text-foreground">{support.bank_name}</span>
                </div>
                <CopyButton
                  text={support.bank_name}
                  title="Copy bank name"
                  className="p-2 rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                />
              </div>
            </div>

            {/* Account Name */}
            <div className="group">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Account Name
              </label>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <span className="text-lg font-bold text-foreground">{support.account_name}</span>
                </div>
                <CopyButton
                  text={support.account_name}
                  title="Copy account name"
                  className="p-2 rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                />
              </div>
            </div>

            {/* Account Number */}
            <div className="group">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                Account Number
              </label>
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border-2 border-primary/20 group-hover:bg-primary/15 transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-primary font-mono tracking-wider">{support.account_number}</span>
                </div>
                <CopyButton
                  text={support.account_number}
                  title="Copy account number"
                  className="p-2 rounded-lg hover:bg-primary/20 transition-colors text-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-2">Phone</h3>
                <a
                  href={`tel:${support.phone}`}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  {support.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-2">Email</h3>
                <a
                  href={`mailto:${support.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors font-medium break-all"
                >
                  {support.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="mt-12 text-center">
          <div className="glass-card p-8 rounded-3xl bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
            <Heart className="h-8 w-8 text-primary mx-auto mb-4" fill="currentColor" />
            <h3 className="text-2xl font-bold text-foreground mb-3">Thank You!</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every contribution, big or small, helps us continue our mission of developing credible leaders.
              We deeply appreciate your support and partnership in this transformative journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
