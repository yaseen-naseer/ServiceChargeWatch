import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SCTrendChart } from '@/components/charts/sc-trend-chart'
import { HOTEL_TYPE_LABELS, MONTHS } from '@/lib/constants'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function HotelProfilePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch hotel details
  const { data: hotel, error: hotelError } = await supabase
    .from('hotels')
    .select('*')
    .eq('id', id)
    .single()

  if (hotelError || !hotel) {
    notFound()
  }

  // Fetch all SC records for this hotel (last 12 months)
  const { data: scRecords } = await supabase
    .from('sc_records')
    .select('*')
    .eq('hotel_id', id)
    .eq('verification_status', 'verified')
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .limit(12)

  // Get current month record
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const currentRecord = scRecords?.find(
    r => r.month === currentMonth && r.year === currentYear
  )

  // Calculate stats
  const stats = {
    currentAmount: currentRecord?.total_usd || 0,
    averageAmount: scRecords?.length
      ? scRecords.reduce((sum, r) => sum + (r.total_usd || 0), 0) / scRecords.length
      : 0,
    highestAmount: scRecords?.length
      ? Math.max(...scRecords.map(r => r.total_usd || 0))
      : 0,
    lowestAmount: scRecords?.length
      ? Math.min(...scRecords.map(r => r.total_usd || 0))
      : 0,
  }

  // Calculate trend
  let trend: 'up' | 'down' | 'stable' = 'stable'
  if (scRecords && scRecords.length >= 2) {
    const latestAmount = scRecords[0]?.total_usd || 0
    const previousAmount = scRecords[1]?.total_usd || 0
    const percentChange = ((latestAmount - previousAmount) / previousAmount) * 100

    if (percentChange > 2) trend = 'up'
    else if (percentChange < -2) trend = 'down'
  }

  // Prepare chart data (reverse to show oldest first)
  const chartData = scRecords
    ?.slice()
    .reverse()
    .map(record => ({
      month: `${MONTHS[record.month - 1].substring(0, 3)} ${record.year}`,
      usd: record.usd_amount,
      mvr: record.mvr_amount || undefined,
      total: record.total_usd || 0,
    })) || []

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
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leaderboard
          </Link>
        </Button>

        {/* Hotel Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-4xl font-bold mb-2">{hotel.name}</h2>
              <div className="flex gap-4 items-center">
                <Badge variant="outline" className="text-base">
                  {hotel.atoll}
                </Badge>
                <Badge variant="secondary" className="text-base">
                  {HOTEL_TYPE_LABELS[hotel.type as keyof typeof HOTEL_TYPE_LABELS]}
                </Badge>
                {hotel.staff_count && (
                  <span className="text-muted-foreground">
                    ~{hotel.staff_count} staff members
                  </span>
                )}
              </div>
            </div>
            {currentRecord && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Current Month</p>
                <p className="text-3xl font-bold text-primary">
                  ${currentRecord.total_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  {trend === 'up' && (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Increasing</span>
                    </>
                  )}
                  {trend === 'down' && (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">Decreasing</span>
                    </>
                  )}
                  {trend === 'stable' && (
                    <>
                      <Minus className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Stable</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <Card className="hover-lift border-2 shadow-lg">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium">📅 Current Month</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                ${stats.currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-2 shadow-lg">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium">📊 12-Month Average</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                ${stats.averageAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-2 shadow-lg border-green-200 bg-green-50/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium text-green-800">⬆️ Highest Payment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-700">
                ${stats.highestAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-2 shadow-lg border-orange-200 bg-orange-50/30">
            <CardHeader className="pb-2">
              <CardDescription className="text-sm font-medium text-orange-800">⬇️ Lowest Payment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-700">
                ${stats.lowestAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart */}
        <div className="mb-8">
          <SCTrendChart data={chartData} hotelName={hotel.name} />
        </div>

        {/* Recent Records Table */}
        <Card className="border-2 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span className="text-2xl">💰</span>
              Payment History
            </CardTitle>
            <CardDescription>Verified service charge records for the past 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            {scRecords && scRecords.length > 0 ? (
              <div className="space-y-4">
                {scRecords.map((record) => (
                  <div key={record.id} className="flex justify-between items-center border-b pb-4 hover:bg-primary/5 -mx-2 px-2 py-2 rounded-lg transition-colors">
                    <div>
                      <p className="font-semibold text-lg">
                        {MONTHS[record.month - 1]} {record.year}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Verified {record.verified_at ? format(new Date(record.verified_at), 'MMM d, yyyy') : 'recently'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        ${record.total_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-muted-foreground font-mono">
                        USD: ${record.usd_amount.toLocaleString()}
                        {record.mvr_amount && ` | MVR: ${record.mvr_amount.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-muted-foreground text-lg">
                  No payment history available for this hotel
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-8 animate-fade-in">
          <Card className="p-12 text-center hover-lift border-2 shadow-xl gradient-bg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-3xl font-bold mb-3">Work at {hotel.name}?</h3>
              <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
                Help keep this data up to date by submitting your service charge information. Your contribution helps fellow workers make informed career decisions.
              </p>
              <Button size="lg" asChild className="gradient-primary text-white shadow-lg hover-lift border-0 text-lg px-8 py-6">
                <Link href="/submit">Submit SC Data →</Link>
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
