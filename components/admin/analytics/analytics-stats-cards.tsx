'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsData } from '@/lib/analytics/queries'

interface AnalyticsStatsCardsProps {
  data: AnalyticsData
}

export function AnalyticsStatsCards({ data }: AnalyticsStatsCardsProps) {
  const { stats } = data

  const approvalRate = stats.totalSubmissions > 0
    ? ((stats.totalApproved / stats.totalSubmissions) * 100).toFixed(1)
    : '0'

  const rejectionRate = stats.totalSubmissions > 0
    ? ((stats.totalRejected / stats.totalSubmissions) * 100).toFixed(1)
    : '0'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
      <Card className="hover-lift border-2 shadow-lg">
        <CardHeader className="pb-3">
          <CardDescription className="text-sm font-medium">📊 Total Submissions</CardDescription>
          <CardTitle className="text-4xl font-bold text-primary">
            {stats.totalSubmissions.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm">
            <span className="text-green-600">✓ {stats.totalApproved} approved</span>
            <span className="text-orange-600">✗ {stats.totalRejected} rejected</span>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift border-2 shadow-lg border-green-200 bg-green-50/30">
        <CardHeader className="pb-3">
          <CardDescription className="text-sm font-medium text-green-800">✅ Approval Rate</CardDescription>
          <CardTitle className="text-4xl font-bold text-green-700">
            {approvalRate}%
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {stats.totalApproved} of {stats.totalSubmissions} submissions approved
          </p>
        </CardContent>
      </Card>

      <Card className="hover-lift border-2 shadow-lg">
        <CardHeader className="pb-3">
          <CardDescription className="text-sm font-medium">⏱️ Avg Approval Time</CardDescription>
          <CardTitle className="text-4xl font-bold text-primary">
            {stats.averageApprovalTime.toFixed(1)}h
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Time from submission to approval
          </p>
        </CardContent>
      </Card>

      <Card className="hover-lift border-2 shadow-lg">
        <CardHeader className="pb-3">
          <CardDescription className="text-sm font-medium">👥 Active Contributors</CardDescription>
          <CardTitle className="text-4xl font-bold text-primary">
            {stats.totalUsers.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {stats.totalHotels} hotels reporting
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
