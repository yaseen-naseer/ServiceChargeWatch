import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SubmissionHistory } from '@/components/submissions/submission-history'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function SubmissionsPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirectTo=/submissions')
  }

  // Fetch user's submissions
  const { data: submissions, error } = await supabase
    .from('submissions')
    .select(`
      *,
      hotels (*)
    `)
    .eq('submitter_user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching submissions:', error)
  }

  // Fetch all hotels for the edit dialog
  const { data: hotels } = await supabase
    .from('hotels')
    .select('*')
    .order('name')

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
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Page Title */}
        <div className="mb-12 animate-fade-in">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            📝 Your Submissions
          </div>
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Submission History
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Track the status of your service charge data submissions and see when they get verified
          </p>
        </div>

        {/* Submission History Component */}
        <div className="animate-slide-up">
          <SubmissionHistory
            submissions={submissions || []}
            userEmail={user.email || ''}
            hotels={hotels || []}
          />
        </div>
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
