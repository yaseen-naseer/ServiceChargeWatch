import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
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
            About Service Charge Watch
          </h2>
          <p className="text-xl text-muted-foreground">
            Empowering hospitality workers through transparency
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span className="text-3xl">🎯</span>
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Service Charge Watch is a community-driven platform dedicated to bringing transparency to service charge distributions across hotels in the Maldives. We believe that hospitality workers deserve to know and compare service charge payments to make informed career decisions.
            </p>
            <p>
              By collecting and verifying service charge data from hotel employees across the country, we create a comprehensive leaderboard that shows which properties treat their staff fairly and competitively.
            </p>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span className="text-3xl">⚙️</span>
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Submit Your Data</h3>
                  <p className="text-muted-foreground">
                    Hotel employees can anonymously submit their monthly service charge amounts along with proof (payslip photo with personal info blurred).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Admin Verification</h3>
                  <p className="text-muted-foreground">
                    Our team reviews each submission to ensure authenticity. We cross-reference multiple submissions for the same hotel and month to verify accuracy.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full gradient-primary text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Public Transparency</h3>
                  <p className="text-muted-foreground">
                    Once verified, the data appears on our public leaderboard, showing monthly rankings and historical trends. All worker identities remain protected.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span className="text-3xl">❓</span>
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Is my identity protected?</h3>
              <p className="text-muted-foreground">
                Yes, completely. We only require your email for verification purposes, but it is never displayed publicly. Your submissions are anonymous to everyone except our admin team.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">How do you verify the data?</h3>
              <p className="text-muted-foreground">
                We require photo proof of payslips (with personal information blurred) and cross-reference multiple submissions from the same hotel. Our admin team manually reviews each submission before approval.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Can hotels manipulate their ranking?</h3>
              <p className="text-muted-foreground">
                No. We have fraud prevention measures including email verification, IP tracking, and flagging of suspicious submissions. Multiple conflicting reports for the same period are investigated thoroughly.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Why both USD and MVR amounts?</h3>
              <p className="text-muted-foreground">
                Some hotels pay primary service charge in USD and a secondary amount in MVR. We track both to ensure fair comparison. Total amounts are converted to USD using the official exchange rate at submission time.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">What happens to rejected submissions?</h3>
              <p className="text-muted-foreground">
                If your submission is rejected, you'll receive an email with the reason. Common reasons include missing proof, unclear documentation, or conflicting data. You can always resubmit with corrected information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Who runs this platform?</h3>
              <p className="text-muted-foreground">
                Service Charge Watch is an independent, community-driven initiative aimed at promoting transparency in the Maldivian hospitality industry. We are not affiliated with any hotel group or tourism body.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mb-8 hover-lift border-2 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span className="text-3xl">📧</span>
              Get In Touch
            </CardTitle>
            <CardDescription>
              Have questions, feedback, or need support?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We're here to help. Whether you're having trouble submitting data, have concerns about a listing, or want to suggest improvements, we'd love to hear from you.
            </p>
            <div className="flex gap-4">
              <Button asChild className="gradient-primary text-white shadow-lg hover-lift border-0">
                <Link href="/submit">Submit Your Data</Link>
              </Button>
              <Button variant="outline" asChild className="hover-lift">
                <Link href="/">View Leaderboard</Link>
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
