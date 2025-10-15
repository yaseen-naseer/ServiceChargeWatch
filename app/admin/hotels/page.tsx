import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { HotelManagement } from '@/components/admin/hotel-management'

export default async function AdminHotelsPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirectTo=/admin/hotels')
  }

  // Check if user is admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!adminUser) {
    redirect('/')
  }

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
                Admin Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">Service Charge Watch</p>
            </div>
          </div>
          <nav className="flex gap-3">
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/submissions" prefetch={false}>My Submissions</Link>
            </Button>
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/admin/dashboard" prefetch={false}>Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/admin/hotels" prefetch={false}>Hotels</Link>
            </Button>
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/admin/users" prefetch={false}>Admins</Link>
            </Button>
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/auth/logout" prefetch={false}>Logout</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            🔐 Admin Access
          </div>
          <h2 className="text-5xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Hotel Management
          </h2>
          <p className="text-muted-foreground text-lg">
            Manage hotels, resorts, and guesthouses in the Maldives
          </p>
        </div>

        {/* Hotel Management Component */}
        <div className="animate-slide-up">
          <HotelManagement />
        </div>
      </main>
    </div>
  )
}
