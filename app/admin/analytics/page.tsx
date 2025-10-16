import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IndustryTrendsChart } from '@/components/admin/analytics/industry-trends-chart'
import { SubmissionPatternsChart } from '@/components/admin/analytics/submission-patterns-chart'
import { TopContributors } from '@/components/admin/analytics/top-contributors'
import { ApprovalTimeMetrics } from '@/components/admin/analytics/approval-time-metrics'
import { RejectionReasonsChart } from '@/components/admin/analytics/rejection-reasons-chart'
import { AnalyticsStatsCards } from '@/components/admin/analytics/analytics-stats-cards'
import { getAnalyticsData } from '@/lib/analytics/queries'

export const metadata = {
  title: 'Analytics Dashboard | Service Charge Watch',
  description: 'Advanced analytics and insights for service charge data',
}

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminUser) {
    redirect('/')
  }

  // Fetch all analytics data
  const analyticsData = await getAnalyticsData(supabase)

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
              <p className="text-xs text-muted-foreground">Admin Analytics Dashboard</p>
            </div>
          </div>
          <nav className="flex gap-3">
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/admin/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/admin/hotels">Hotels</Link>
            </Button>
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/admin/users">Users</Link>
            </Button>
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/">Home</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2">Analytics & Insights</h2>
            <p className="text-muted-foreground text-lg">
              Comprehensive analytics for service charge data and platform metrics
            </p>
          </div>
          <Button variant="outline" asChild className="gap-2">
            <a href="/api/admin/export/analytics" download>
              <Download className="h-4 w-4" />
              Export All Data
            </a>
          </Button>
        </div>

        {/* Stats Overview Cards */}
        <AnalyticsStatsCards data={analyticsData} />

        {/* Analytics Grid */}
        <div className="space-y-8">
          {/* Industry Trends */}
          <IndustryTrendsChart data={analyticsData.industryTrends} />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Submission Patterns */}
            <SubmissionPatternsChart data={analyticsData.submissionPatterns} />

            {/* Rejection Reasons */}
            <RejectionReasonsChart data={analyticsData.rejectionReasons} />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Contributors */}
            <TopContributors data={analyticsData.topContributors} />

            {/* Approval Time Metrics */}
            <ApprovalTimeMetrics data={analyticsData.approvalTimes} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 glass-card">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm font-medium mb-2">Service Charge Watch - Admin Analytics</p>
          <p className="text-sm text-muted-foreground mb-4">
            Advanced insights for platform management
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Built with Next.js 15 & Supabase
          </p>
        </div>
      </footer>
    </div>
  )
}
