import Link from 'next/link'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { LeaderboardClient } from '@/components/leaderboard/leaderboard-client'
import { MonthSelector } from '@/components/month-selector'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PageProps {
  searchParams: Promise<{
    month?: string
    year?: string
  }>
}

export default async function Home({ searchParams }: PageProps) {
  const supabase = await createClient()
  const params = await searchParams

  // Check if user is logged in and is admin
  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false

  if (user) {
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    isAdmin = !!adminUser
  }

  // Get current month and year
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  // Use selected month/year from URL or default to current
  const selectedMonth = params.month ? parseInt(params.month) : currentMonth
  const selectedYear = params.year ? parseInt(params.year) : currentYear
  const monthName = format(new Date(selectedYear, selectedMonth - 1), 'MMMM yyyy')
  const isCurrentMonth = selectedMonth === currentMonth && selectedYear === currentYear

  // Query for all available months with data
  const { data: availableMonthsData } = await supabase
    .from('sc_records')
    .select('month, year')
    .eq('verification_status', 'verified')
    .order('year', { ascending: false })
    .order('month', { ascending: false })

  // Get unique month/year combinations
  const uniqueMonths = availableMonthsData
    ? Array.from(
        new Map(
          availableMonthsData.map(item => [
            `${item.month}-${item.year}`,
            {
              month: item.month,
              year: item.year,
              label: format(new Date(item.year, item.month - 1), 'MMMM yyyy'),
              isCurrent: item.month === currentMonth && item.year === currentYear,
            },
          ])
        ).values()
      )
    : []

  // Fetch leaderboard data for selected month
  const { data: leaderboardData, error } = await supabase
    .from('sc_records')
    .select(`
      *,
      hotels (*)
    `)
    .eq('month', selectedMonth)
    .eq('year', selectedYear)
    .eq('verification_status', 'verified')
    .order('total_usd', { ascending: false })

  if (error) {
    console.error('Error fetching leaderboard:', error)
  }

  // Calculate stats
  const stats = {
    totalHotels: leaderboardData?.length || 0,
    topPaying: leaderboardData?.[0]
      ? {
          name: leaderboardData[0].hotels.name,
          amount: leaderboardData[0].total_usd,
        }
      : null,
    averageSC: leaderboardData?.length
      ? leaderboardData.reduce((sum, entry) => sum + (entry.total_usd || 0), 0) / leaderboardData.length
      : 0,
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
            {user && (
              <Button variant="ghost" asChild className="hover-lift">
                <Link href="/submissions" prefetch={false}>My Submissions</Link>
              </Button>
            )}
            {isAdmin && (
              <Button variant="ghost" asChild className="hover-lift">
                <Link href="/admin/dashboard" prefetch={false}>Admin</Link>
              </Button>
            )}
            {!user && (
              <Button variant="ghost" asChild className="hover-lift">
                <Link href="/auth/login">Login</Link>
              </Button>
            )}
            {user && (
              <Button variant="ghost" asChild className="hover-lift">
                <Link href="/auth/logout" prefetch={false}>Logout</Link>
              </Button>
            )}
            <Button asChild className="gradient-primary text-white shadow-lg hover-lift border-0">
              <Link href="/submit">Submit SC Data</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            🏝️ Transparency for Hospitality Workers
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Service Charge Leaderboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering workers in the Maldives with transparent service charge data
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up">
          <Card className="hover-lift border-2 shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-sm font-medium">
                🥇 Best Paying {isCurrentMonth ? 'This Month' : 'Hotel'}
              </CardDescription>
              <CardTitle className="text-xl">
                {stats.topPaying ? stats.topPaying.name : 'No data yet'}
              </CardTitle>
            </CardHeader>
            {stats.topPaying && (
              <CardContent>
                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  ${stats.topPaying.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </CardContent>
            )}
          </Card>

          <Card className="hover-lift border-2 shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-sm font-medium">📊 Average SC</CardDescription>
              <CardTitle className="text-xl">Across All Hotels</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                ${stats.averageSC.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-2 shadow-lg">
            <CardHeader className="pb-3">
              <CardDescription className="text-sm font-medium">🏨 Hotels Reporting</CardDescription>
              <CardTitle className="text-xl">{isCurrentMonth ? 'This Month' : monthName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {stats.totalHotels}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Month Selector & Leaderboard Title */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              {monthName} Service Charge Rankings
            </h3>
            <p className="text-muted-foreground text-lg">
              Showing verified service charge payments for {monthName}
            </p>
          </div>
          <MonthSelector
            availableMonths={uniqueMonths}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>

        {/* Leaderboard Table with Search & Filters */}
        <div className="mb-12 animate-slide-up">
          <LeaderboardClient
            data={leaderboardData || []}
            currentMonth={monthName}
          />
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center animate-fade-in">
          <Card className="p-12 hover-lift border-2 shadow-xl gradient-bg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-3xl font-bold mb-3">Work at a hotel in the Maldives?</h3>
              <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
                Help us build transparency by sharing your service charge information. Your contribution helps fellow workers make informed career decisions.
              </p>
              <Button size="lg" asChild className="gradient-primary text-white shadow-lg hover-lift border-0 text-lg px-8 py-6">
                <Link href="/submit">Submit Your SC Data →</Link>
              </Button>
            </div>
          </Card>
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
