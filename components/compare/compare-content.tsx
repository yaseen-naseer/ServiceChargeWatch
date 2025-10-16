'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Share2, Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ComparisonChart } from '@/components/charts/comparison-chart'
import { ComparisonTable } from '@/components/compare/comparison-table'
import { HotelSelector } from '@/components/compare/hotel-selector'
import { toast } from 'sonner'
import { HOTEL_TYPE_LABELS } from '@/lib/constants'

interface Hotel {
  id: string
  name: string
  atoll: string
  type: string
  staff_count: number | null
}

interface SCRecord {
  id: string
  hotel_id: string
  month: number
  year: number
  usd_amount: number
  mvr_amount: number | null
  total_usd: number
  verified_at: string
}

interface HotelData {
  hotel: Hotel
  records: SCRecord[]
  stats: {
    currentAmount: number
    averageAmount: number
    highestAmount: number
    lowestAmount: number
  }
}

export function CompareContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [selectedHotelIds, setSelectedHotelIds] = useState<string[]>([])
  const [comparisonData, setComparisonData] = useState<HotelData[]>([])
  const [loading, setLoading] = useState(true)

  // Load all hotels and parse URL params
  useEffect(() => {
    loadHotels()
    const hotelIds = searchParams.get('hotels')
    if (hotelIds) {
      setSelectedHotelIds(hotelIds.split(',').slice(0, 3))
    }
  }, [searchParams])

  // Load comparison data when selection changes
  useEffect(() => {
    if (selectedHotelIds.length > 0) {
      loadComparisonData()
    } else {
      setComparisonData([])
    }
  }, [selectedHotelIds])

  async function loadHotels() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('hotels')
      .select('*')
      .eq('status', 'active')
      .order('name')

    if (error) {
      toast.error('Failed to load hotels')
      console.error(error)
    } else {
      setHotels(data || [])
    }
    setLoading(false)
  }

  async function loadComparisonData() {
    setLoading(true)
    const supabase = createClient()
    const dataPromises = selectedHotelIds.map(async (hotelId) => {
      // Fetch hotel details
      const { data: hotel } = await supabase
        .from('hotels')
        .select('*')
        .eq('id', hotelId)
        .single()

      if (!hotel) return null

      // Fetch SC records (last 12 months)
      const { data: records } = await supabase
        .from('sc_records')
        .select('*')
        .eq('hotel_id', hotelId)
        .eq('verification_status', 'verified')
        .order('year', { ascending: false })
        .order('month', { ascending: false })
        .limit(12)

      // Calculate stats
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()
      const currentRecord = records?.find(
        r => r.month === currentMonth && r.year === currentYear
      )

      const stats = {
        currentAmount: currentRecord?.total_usd || 0,
        averageAmount: records?.length
          ? records.reduce((sum, r) => sum + (r.total_usd || 0), 0) / records.length
          : 0,
        highestAmount: records?.length
          ? Math.max(...records.map(r => r.total_usd || 0))
          : 0,
        lowestAmount: records?.length
          ? Math.min(...records.map(r => r.total_usd || 0))
          : 0,
      }

      return {
        hotel,
        records: records || [],
        stats,
      }
    })

    const data = await Promise.all(dataPromises)
    setComparisonData(data.filter(d => d !== null) as HotelData[])
    setLoading(false)
  }

  function handleSelectHotel(hotelId: string) {
    if (selectedHotelIds.includes(hotelId)) {
      return // Already selected
    }
    if (selectedHotelIds.length >= 3) {
      toast.error('You can compare up to 3 hotels at a time')
      return
    }
    const newIds = [...selectedHotelIds, hotelId]
    setSelectedHotelIds(newIds)
    updateURL(newIds)
  }

  function handleRemoveHotel(hotelId: string) {
    const newIds = selectedHotelIds.filter(id => id !== hotelId)
    setSelectedHotelIds(newIds)
    updateURL(newIds)
  }

  function updateURL(hotelIds: string[]) {
    if (hotelIds.length === 0) {
      router.push('/compare')
    } else {
      router.push(`/compare?hotels=${hotelIds.join(',')}`)
    }
  }

  function handleShare() {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success('Comparison link copied to clipboard!')
  }

  function handleClearAll() {
    setSelectedHotelIds([])
    setComparisonData([])
    router.push('/compare')
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

        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">Compare Hotels</h2>
          <p className="text-muted-foreground text-lg">
            Compare service charge payments across multiple hotels to make informed career decisions
          </p>
        </div>

        {/* Hotel Selection */}
        <Card className="mb-8 border-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Select Hotels to Compare</CardTitle>
                <CardDescription>Choose 2-3 hotels to compare their service charge payments</CardDescription>
              </div>
              {selectedHotelIds.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Comparison
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClearAll}>
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Selected Hotels */}
            {selectedHotelIds.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedHotelIds.map((hotelId) => {
                  const hotel = hotels.find(h => h.id === hotelId)
                  if (!hotel) return null
                  return (
                    <Badge
                      key={hotelId}
                      variant="secondary"
                      className="px-3 py-2 text-sm flex items-center gap-2"
                    >
                      {hotel.name}
                      <button
                        onClick={() => handleRemoveHotel(hotelId)}
                        className="hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            )}

            {/* Hotel Selector */}
            <HotelSelector
              hotels={hotels}
              selectedHotelIds={selectedHotelIds}
              onSelectHotel={handleSelectHotel}
              maxSelections={3}
            />
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {loading && selectedHotelIds.length > 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-muted-foreground text-lg">Loading comparison data...</p>
          </div>
        )}

        {!loading && comparisonData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-muted-foreground text-lg mb-2">
              Select hotels above to start comparing
            </p>
            <p className="text-sm text-muted-foreground">
              Choose 2-3 hotels to see side-by-side service charge comparisons
            </p>
          </div>
        )}

        {!loading && comparisonData.length > 0 && (
          <div className="space-y-8 animate-fade-in">
            {/* Comparison Chart */}
            <ComparisonChart data={comparisonData} />

            {/* Comparison Table */}
            <ComparisonTable data={comparisonData} />

            {/* Hotel Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparisonData.map(({ hotel, stats }) => (
                <Card key={hotel.id} className="hover-lift border-2 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{hotel.name}</span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/hotels/${hotel.id}`}>View →</Link>
                      </Button>
                    </CardTitle>
                    <CardDescription className="flex gap-2">
                      <Badge variant="outline">{hotel.atoll}</Badge>
                      <Badge variant="secondary">
                        {HOTEL_TYPE_LABELS[hotel.type as keyof typeof HOTEL_TYPE_LABELS]}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Month</p>
                      <p className="text-2xl font-bold text-primary">
                        ${stats.currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">12-Month Average</p>
                      <p className="text-xl font-semibold">
                        ${stats.averageAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-muted-foreground">Highest</p>
                        <p className="font-semibold text-green-600">
                          ${stats.highestAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Lowest</p>
                        <p className="font-semibold text-orange-600">
                          ${stats.lowestAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
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
