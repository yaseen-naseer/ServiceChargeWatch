import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SubmissionForm } from '@/components/forms/submission-form'
import { Button } from '@/components/ui/button'

export default async function SubmitPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirectTo=/submit')
  }

  // Fetch all hotels for the dropdown
  const { data: hotels } = await supabase
    .from('hotels')
    .select('*')
    .eq('status', 'active')
    .order('name')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Service Charge Watch</h1>
            <p className="text-sm text-muted-foreground">Maldives Hotel Transparency Platform</p>
          </div>
          <nav className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/about">About</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/auth/logout">Logout</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">Submit Service Charge Data</h2>
          <p className="text-muted-foreground">
            Your contribution helps build transparency in the Maldives hospitality industry
          </p>
        </div>

        <SubmissionForm hotels={hotels || []} userEmail={user.email} />

        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Privacy & Verification</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Your email will not be displayed publicly</li>
              <li>• All submissions are reviewed by our admin team</li>
              <li>• Upload proof (payslip) to speed up verification</li>
              <li>• Please blur any personal information in uploaded images</li>
              <li>• You can track your submission status from your dashboard</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Service Charge Watch - Empowering hospitality workers through transparency</p>
        </div>
      </footer>
    </div>
  )
}
