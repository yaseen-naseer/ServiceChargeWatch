import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAnalyticsData } from '@/lib/analytics/queries'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!adminUser) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    // Fetch analytics data
    const analyticsData = await getAnalyticsData(supabase)

    // Create CSV content
    let csv = '# Service Charge Watch - Analytics Data Export\n'
    csv += `# Generated: ${new Date().toISOString()}\n\n`

    // Stats Overview
    csv += '=== PLATFORM STATISTICS ===\n'
    csv += 'Metric,Value\n'
    csv += `Total Submissions,${analyticsData.stats.totalSubmissions}\n`
    csv += `Total Approved,${analyticsData.stats.totalApproved}\n`
    csv += `Total Rejected,${analyticsData.stats.totalRejected}\n`
    csv += `Total Pending,${analyticsData.stats.totalPending}\n`
    csv += `Total Active Hotels,${analyticsData.stats.totalHotels}\n`
    csv += `Total Contributors,${analyticsData.stats.totalUsers}\n`
    csv += `Average Approval Time (hours),${analyticsData.stats.averageApprovalTime.toFixed(2)}\n\n`

    // Industry Trends
    csv += '=== INDUSTRY TRENDS ===\n'
    csv += 'Month,Year,Average SC (USD),Total Hotels,Highest SC (USD),Lowest SC (USD)\n'
    analyticsData.industryTrends.forEach(trend => {
      csv += `"${trend.month}",${trend.year},${trend.averageSC.toFixed(2)},${trend.totalHotels},${trend.highestSC.toFixed(2)},${trend.lowestSC.toFixed(2)}\n`
    })
    csv += '\n'

    // Submission Patterns
    csv += '=== SUBMISSION PATTERNS (Last 30 Days) ===\n'
    csv += 'Date,Total Submissions,Approved,Pending,Rejected\n'
    analyticsData.submissionPatterns.forEach(pattern => {
      csv += `${pattern.date},${pattern.count},${pattern.approved},${pattern.pending},${pattern.rejected}\n`
    })
    csv += '\n'

    // Top Contributors
    csv += '=== TOP CONTRIBUTORS ===\n'
    csv += 'Email,Total Submissions,Approved,Rejected,Pending\n'
    analyticsData.topContributors.forEach(contributor => {
      csv += `"${contributor.email}",${contributor.totalSubmissions},${contributor.approvedCount},${contributor.rejectedCount},${contributor.pendingCount}\n`
    })
    csv += '\n'

    // Approval Times
    if (analyticsData.approvalTimes.averageHours > 0) {
      csv += '=== APPROVAL TIME METRICS ===\n'
      csv += 'Metric,Hours\n'
      csv += `Average,${analyticsData.approvalTimes.averageHours.toFixed(2)}\n`
      csv += `Median,${analyticsData.approvalTimes.medianHours.toFixed(2)}\n`
      csv += `Fastest,${analyticsData.approvalTimes.fastestHours.toFixed(2)}\n`
      csv += `Slowest,${analyticsData.approvalTimes.slowestHours.toFixed(2)}\n\n`

      if (analyticsData.approvalTimes.byMonth.length > 0) {
        csv += 'Month,Average Approval Time (hours)\n'
        analyticsData.approvalTimes.byMonth.forEach(month => {
          csv += `${month.month},${month.averageHours.toFixed(2)}\n`
        })
        csv += '\n'
      }
    }

    // Rejection Reasons
    if (analyticsData.rejectionReasons.length > 0) {
      csv += '=== REJECTION REASONS ===\n'
      csv += 'Reason,Count,Percentage\n'
      analyticsData.rejectionReasons.forEach(reason => {
        csv += `"${reason.reason}",${reason.count},${reason.percentage.toFixed(2)}%\n`
      })
    }

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="analytics-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting analytics:', error)
    return NextResponse.json({ error: 'Failed to export analytics' }, { status: 500 })
  }
}
