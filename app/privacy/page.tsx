import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
              SC
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Service Charge Watch
              </h1>
              <p className="text-xs text-muted-foreground">Maldives Hotel Transparency Platform</p>
            </div>
          </div>
          <nav className="flex gap-3">
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/about">About</Link>
            </Button>
            <Button asChild className="gradient-primary text-white shadow-lg hover-lift border-0">
              <Link href="/submit">Submit SC Data</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero */}
        <div className="mb-12 text-center animate-fade-in">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Privacy Policy
          </h2>
          <p className="text-muted-foreground">
            Last updated: October 11, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Service Charge Watch ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p>
              We understand the sensitive nature of service charge data and take extensive measures to protect the identity of our contributors.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Account Information</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Email address (for account creation and verification)</li>
                <li>Password (encrypted and hashed)</li>
                <li>Account creation date</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Submission Data</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Hotel name and location</li>
                <li>Service charge amounts (USD/MVR)</li>
                <li>Month and year of payment</li>
                <li>Your position (optional)</li>
                <li>Payslip photos (stored securely)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Technical Information</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>IP address (for fraud prevention)</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Access times and dates</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Verify and authenticate your account</li>
              <li>Process and verify service charge submissions</li>
              <li>Display verified data on public leaderboards</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Send notifications about submission status</li>
              <li>Improve our platform and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">How We Protect Your Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Anonymity Protection</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Your email is NEVER displayed publicly</li>
                <li>Submissions are anonymous on the public leaderboard</li>
                <li>Only admin team can see submitter emails (for verification only)</li>
                <li>Payslip photos are stored in a secure, access-controlled bucket</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Technical Security</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>All data transmitted using SSL/TLS encryption</li>
                <li>Passwords hashed using industry-standard algorithms</li>
                <li>Row-level security on database tables</li>
                <li>Regular security audits and updates</li>
                <li>Secure authentication via Supabase Auth</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">What We Share Publicly</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Hotel names and locations</li>
                <li>Service charge amounts (verified data only)</li>
                <li>Month/year of payments</li>
                <li>Aggregate statistics and trends</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">What We NEVER Share</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Your email address</li>
                <li>Your personal information</li>
                <li>Raw payslip photos</li>
                <li>IP addresses or technical data</li>
                <li>Any information that could identify you</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Legal Disclosure</h3>
              <p>
                We may disclose your information if required by law, court order, or government request, or if we believe disclosure is necessary to protect our rights or prevent illegal activity.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
              <li><strong>Object:</strong> Object to processing of your personal data</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us through the platform or via email.
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Account data:</strong> Retained until you delete your account</li>
              <li><strong>Verified submissions:</strong> Retained indefinitely for historical records (but anonymized)</li>
              <li><strong>Rejected submissions:</strong> Retained for 90 days then deleted</li>
              <li><strong>Payslip photos:</strong> Retained for 1 year after verification</li>
              <li><strong>Technical logs:</strong> Retained for 30 days</li>
            </ul>
            <p className="mt-4">
              When you delete your account, all your personal information is removed. However, verified service charge data remains on the leaderboard (anonymously) to maintain historical accuracy.
            </p>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We use essential cookies to maintain your session and authentication. We do not use tracking cookies or analytics that identify individual users.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>Session cookies:</strong> Required for login and security</li>
              <li><strong>Preference cookies:</strong> Remember your settings</li>
              <li><strong>Security cookies:</strong> Protect against fraud</li>
            </ul>
          </CardContent>
        </Card>

        {/* Children's Privacy */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              Our platform is intended for adults employed in the hospitality industry. We do not knowingly collect information from anyone under 18 years of age. If you believe we have inadvertently collected such information, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by email or through a prominent notice on our platform. Your continued use of the service after changes indicates acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              If you have questions about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <ul className="space-y-1">
              <li><strong>Platform:</strong> Service Charge Watch</li>
              <li><strong>Type:</strong> Community transparency platform</li>
              <li><strong>Purpose:</strong> Hospitality worker empowerment</li>
            </ul>
            <div className="mt-6">
              <Button asChild className="gradient-primary text-white shadow-lg hover-lift border-0">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 glass-card">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm font-medium mb-2">Service Charge Watch</p>
          <p className="text-sm text-muted-foreground mb-4">
            Empowering hospitality workers through transparency
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="https://github.com" className="hover:text-primary transition-colors">GitHub</Link>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Built with Next.js 15 & Supabase
          </p>
        </div>
      </footer>
    </div>
  )
}
