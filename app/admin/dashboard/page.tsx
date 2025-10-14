import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { VerificationQueue } from '@/components/admin/verification-queue'
import { ExportButtons } from '@/components/admin/export-buttons'
import { SubmissionFilters } from '@/components/admin/submission-filters'

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    per_page?: string
    hotel?: string
    atoll?: string
    month?: string
    year?: string
    min_amount?: string
    max_amount?: string
    status?: string
  }>
}) {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirectTo=/admin/dashboard')
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

  // Await searchParams (Next.js 15)
  const params = await searchParams

  // Pagination parameters
  const page = Number(params.page) || 1
  const perPage = Number(params.per_page) || 20
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  // Filter parameters
  const statusFilter = params.status || 'pending'
  const hotelFilter = params.hotel
  const atollFilter = params.atoll
  const monthFilter = params.month ? Number(params.month) : undefined
  const yearFilter = params.year ? Number(params.year) : undefined
  const minAmount = params.min_amount ? Number(params.min_amount) : undefined
  const maxAmount = params.max_amount ? Number(params.max_amount) : undefined

  // Build query with filters
  let query = supabase
    .from('submissions')
    .select(`
      *,
      hotels (*)
    `, { count: 'exact' })
    .eq('status', statusFilter)

  // Apply filters
  if (hotelFilter) {
    query = query.eq('hotel_id', hotelFilter)
  }

  if (monthFilter) {
    query = query.eq('month', monthFilter)
  }

  if (yearFilter) {
    query = query.eq('year', yearFilter)
  }

  if (minAmount) {
    query = query.gte('usd_amount', minAmount)
  }

  if (maxAmount) {
    query = query.lte('usd_amount', maxAmount)
  }

  // Apply atoll filter (needs to filter on nested hotels.atoll)
  if (atollFilter) {
    query = query.eq('hotels.atoll', atollFilter)
  }

  const { data: submissions, count: totalSubmissions } = await query
    .order('created_at', { ascending: true })
    .range(from, to)

  // Fetch stats
  const { count: pendingCount } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: approvedCount } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  const { count: rejectedCount } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'rejected')

  // Fetch all hotels for filter dropdown
  const { data: hotels } = await supabase
    .from('hotels')
    .select('id, name, atoll')
    .order('name')

  // Get unique atolls
  const atolls = hotels ? Array.from(new Set(hotels.map(h => h.atoll))).sort() : []

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
        <div className="mb-8 flex justify-between items-start animate-fade-in">
          <div>
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              🔐 Admin Access
            </div>
            <h2 className="text-5xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Verification Dashboard
            </h2>
            <p className="text-muted-foreground text-lg">
              Review and verify service charge submissions from hotel workers
            </p>
          </div>
          <ExportButtons />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          <Card className="hover-lift border-2 shadow-lg border-yellow-200 bg-yellow-50/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium text-yellow-800">⏳ Pending Review</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-yellow-700">{pendingCount || 0}</p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-2 shadow-lg border-green-200 bg-green-50/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium text-green-800">✅ Approved</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-700">{approvedCount || 0}</p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-2 shadow-lg border-red-200 bg-red-50/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium text-red-800">❌ Rejected</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-red-700">{rejectedCount || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="animate-slide-up">
          <SubmissionFilters
            hotels={hotels || []}
            atolls={atolls}
          />
        </div>

        {/* Verification Queue */}
        <div className="animate-slide-up">
          <VerificationQueue
            submissions={submissions || []}
            currentPage={page}
            perPage={perPage}
            totalCount={totalSubmissions || 0}
          />
        </div>
      </main>
    </div>
  )
}
