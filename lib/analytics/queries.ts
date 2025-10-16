import { SupabaseClient } from '@supabase/supabase-js'

export interface IndustryTrendDataPoint {
  month: string
  year: number
  monthNum: number
  averageSC: number
  totalHotels: number
  totalRecords: number
  highestSC: number
  lowestSC: number
}

export interface SubmissionPattern {
  date: string
  count: number
  approved: number
  rejected: number
  pending: number
}

export interface TopContributor {
  userId: string
  email: string
  totalSubmissions: number
  approvedCount: number
  rejectedCount: number
  pendingCount: number
}

export interface ApprovalTimeData {
  averageHours: number
  medianHours: number
  fastestHours: number
  slowestHours: number
  byMonth: Array<{
    month: string
    averageHours: number
  }>
}

export interface RejectionReason {
  reason: string
  count: number
  percentage: number
}

export interface AnalyticsStats {
  totalSubmissions: number
  totalApproved: number
  totalRejected: number
  totalPending: number
  totalHotels: number
  totalUsers: number
  averageApprovalTime: number
}

export interface AnalyticsData {
  stats: AnalyticsStats
  industryTrends: IndustryTrendDataPoint[]
  submissionPatterns: SubmissionPattern[]
  topContributors: TopContributor[]
  approvalTimes: ApprovalTimeData
  rejectionReasons: RejectionReason[]
}

export async function getAnalyticsData(supabase: SupabaseClient): Promise<AnalyticsData> {
  // Fetch all data in parallel
  const [
    statsData,
    industryTrendsData,
    submissionPatternsData,
    topContributorsData,
    approvalTimesData,
    rejectionReasonsData,
  ] = await Promise.all([
    getStats(supabase),
    getIndustryTrends(supabase),
    getSubmissionPatterns(supabase),
    getTopContributors(supabase),
    getApprovalTimes(supabase),
    getRejectionReasons(supabase),
  ])

  return {
    stats: statsData,
    industryTrends: industryTrendsData,
    submissionPatterns: submissionPatternsData,
    topContributors: topContributorsData,
    approvalTimes: approvalTimesData,
    rejectionReasons: rejectionReasonsData,
  }
}

async function getStats(supabase: SupabaseClient): Promise<AnalyticsStats> {
  // Get submission counts
  const { data: submissions } = await supabase
    .from('submissions')
    .select('status')

  const totalSubmissions = submissions?.length || 0
  const totalApproved = submissions?.filter(s => s.status === 'approved').length || 0
  const totalRejected = submissions?.filter(s => s.status === 'rejected').length || 0
  const totalPending = submissions?.filter(s => s.status === 'pending').length || 0

  // Get hotel count
  const { count: hotelCount } = await supabase
    .from('hotels')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  // Get unique submitter count
  const { data: uniqueUsers } = await supabase
    .from('submissions')
    .select('submitter_user_id')
    .not('submitter_user_id', 'is', null)

  const totalUsers = new Set(uniqueUsers?.map(s => s.submitter_user_id)).size

  // Calculate average approval time
  const { data: approvedSubmissions } = await supabase
    .from('submissions')
    .select('created_at, reviewed_at')
    .eq('status', 'approved')
    .not('reviewed_at', 'is', null)

  let averageApprovalTime = 0
  if (approvedSubmissions && approvedSubmissions.length > 0) {
    const totalHours = approvedSubmissions.reduce((sum, sub) => {
      const created = new Date(sub.created_at)
      const reviewed = new Date(sub.reviewed_at!)
      const hours = (reviewed.getTime() - created.getTime()) / (1000 * 60 * 60)
      return sum + hours
    }, 0)
    averageApprovalTime = totalHours / approvedSubmissions.length
  }

  return {
    totalSubmissions,
    totalApproved,
    totalRejected,
    totalPending,
    totalHotels: hotelCount || 0,
    totalUsers,
    averageApprovalTime,
  }
}

async function getIndustryTrends(supabase: SupabaseClient): Promise<IndustryTrendDataPoint[]> {
  const { data: records } = await supabase
    .from('sc_records')
    .select('month, year, total_usd')
    .eq('verification_status', 'verified')
    .order('year', { ascending: true })
    .order('month', { ascending: true })

  if (!records) return []

  // Group by month/year
  const grouped = records.reduce((acc, record) => {
    const key = `${record.year}-${String(record.month).padStart(2, '0')}`
    if (!acc[key]) {
      acc[key] = {
        year: record.year,
        monthNum: record.month,
        records: [],
      }
    }
    acc[key].records.push(record.total_usd)
    return acc
  }, {} as Record<string, { year: number; monthNum: number; records: number[] }>)

  // Calculate averages
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return Object.entries(grouped)
    .map(([key, data]) => ({
      month: `${MONTHS[data.monthNum - 1]} ${data.year}`,
      year: data.year,
      monthNum: data.monthNum,
      averageSC: data.records.reduce((sum, val) => sum + val, 0) / data.records.length,
      totalHotels: data.records.length,
      totalRecords: data.records.length,
      highestSC: Math.max(...data.records),
      lowestSC: Math.min(...data.records),
    }))
    .slice(-12) // Last 12 months
}

async function getSubmissionPatterns(supabase: SupabaseClient): Promise<SubmissionPattern[]> {
  const { data: submissions } = await supabase
    .from('submissions')
    .select('created_at, status')
    .order('created_at', { ascending: true })

  if (!submissions) return []

  // Group by date
  const grouped = submissions.reduce((acc, submission) => {
    const date = new Date(submission.created_at).toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = {
        date,
        count: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
      }
    }
    acc[date].count++
    if (submission.status === 'approved') acc[date].approved++
    else if (submission.status === 'rejected') acc[date].rejected++
    else if (submission.status === 'pending') acc[date].pending++
    return acc
  }, {} as Record<string, SubmissionPattern>)

  return Object.values(grouped).slice(-30) // Last 30 days
}

async function getTopContributors(supabase: SupabaseClient): Promise<TopContributor[]> {
  const { data: submissions } = await supabase
    .from('submissions')
    .select(`
      submitter_user_id,
      status,
      profiles:submitter_user_id (
        email
      )
    `)
    .not('submitter_user_id', 'is', null)

  if (!submissions) return []

  // Group by user
  const grouped = submissions.reduce((acc, submission) => {
    const userId = submission.submitter_user_id
    if (!userId) return acc

    if (!acc[userId]) {
      acc[userId] = {
        userId,
        email: 'Unknown',
        totalSubmissions: 0,
        approvedCount: 0,
        rejectedCount: 0,
        pendingCount: 0,
      }
    }

    acc[userId].totalSubmissions++
    if (submission.status === 'approved') acc[userId].approvedCount++
    else if (submission.status === 'rejected') acc[userId].rejectedCount++
    else if (submission.status === 'pending') acc[userId].pendingCount++

    return acc
  }, {} as Record<string, TopContributor>)

  // Get user emails
  const { data: users } = await supabase.auth.admin.listUsers()

  Object.values(grouped).forEach(contributor => {
    const user = users?.users.find(u => u.id === contributor.userId)
    if (user) {
      contributor.email = user.email || 'Unknown'
    }
  })

  return Object.values(grouped)
    .sort((a, b) => b.totalSubmissions - a.totalSubmissions)
    .slice(0, 10) // Top 10
}

async function getApprovalTimes(supabase: SupabaseClient): Promise<ApprovalTimeData> {
  const { data: approvedSubmissions } = await supabase
    .from('submissions')
    .select('created_at, reviewed_at')
    .eq('status', 'approved')
    .not('reviewed_at', 'is', null)

  if (!approvedSubmissions || approvedSubmissions.length === 0) {
    return {
      averageHours: 0,
      medianHours: 0,
      fastestHours: 0,
      slowestHours: 0,
      byMonth: [],
    }
  }

  // Calculate hours for each submission
  const hours = approvedSubmissions.map(sub => {
    const created = new Date(sub.created_at)
    const reviewed = new Date(sub.reviewed_at!)
    return (reviewed.getTime() - created.getTime()) / (1000 * 60 * 60)
  }).sort((a, b) => a - b)

  const averageHours = hours.reduce((sum, h) => sum + h, 0) / hours.length
  const medianHours = hours[Math.floor(hours.length / 2)]
  const fastestHours = hours[0]
  const slowestHours = hours[hours.length - 1]

  // Group by month
  const byMonth = approvedSubmissions.reduce((acc, sub) => {
    const month = new Date(sub.reviewed_at!).toISOString().substring(0, 7)
    if (!acc[month]) {
      acc[month] = []
    }
    const created = new Date(sub.created_at)
    const reviewed = new Date(sub.reviewed_at!)
    const h = (reviewed.getTime() - created.getTime()) / (1000 * 60 * 60)
    acc[month].push(h)
    return acc
  }, {} as Record<string, number[]>)

  const byMonthArray = Object.entries(byMonth)
    .map(([month, hours]) => ({
      month,
      averageHours: hours.reduce((sum, h) => sum + h, 0) / hours.length,
    }))
    .slice(-12)

  return {
    averageHours,
    medianHours,
    fastestHours,
    slowestHours,
    byMonth: byMonthArray,
  }
}

async function getRejectionReasons(supabase: SupabaseClient): Promise<RejectionReason[]> {
  const { data: rejections } = await supabase
    .from('submissions')
    .select('rejection_reason')
    .eq('status', 'rejected')
    .not('rejection_reason', 'is', null)

  if (!rejections || rejections.length === 0) return []

  // Count reasons
  const reasonCounts = rejections.reduce((acc, sub) => {
    const reason = sub.rejection_reason || 'Unknown'
    acc[reason] = (acc[reason] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const total = rejections.length

  return Object.entries(reasonCounts)
    .map(([reason, count]) => ({
      reason,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
}
