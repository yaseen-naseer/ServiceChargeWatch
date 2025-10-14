'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Filter, X } from 'lucide-react'
import { MONTHS } from '@/lib/constants'

interface Hotel {
  id: string
  name: string
  atoll: string
}

interface SubmissionFiltersProps {
  hotels: Hotel[]
  atolls: string[]
}

export function SubmissionFilters({ hotels, atolls }: SubmissionFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [status, setStatus] = useState(searchParams.get('status') || 'pending')
  const [hotel, setHotel] = useState(searchParams.get('hotel') || '')
  const [atoll, setAtoll] = useState(searchParams.get('atoll') || '')
  const [month, setMonth] = useState(searchParams.get('month') || '')
  const [year, setYear] = useState(searchParams.get('year') || '')
  const [minAmount, setMinAmount] = useState(searchParams.get('min_amount') || '')
  const [maxAmount, setMaxAmount] = useState(searchParams.get('max_amount') || '')

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (status) params.set('status', status)
    if (hotel) params.set('hotel', hotel)
    if (atoll) params.set('atoll', atoll)
    if (month) params.set('month', month)
    if (year) params.set('year', year)
    if (minAmount) params.set('min_amount', minAmount)
    if (maxAmount) params.set('max_amount', maxAmount)

    // Keep pagination params
    const currentPerPage = searchParams.get('per_page')
    if (currentPerPage) params.set('per_page', currentPerPage)
    params.set('page', '1') // Reset to page 1 when filtering

    router.push(`/admin/dashboard?${params.toString()}`)
  }

  const clearFilters = () => {
    setStatus('pending')
    setHotel('')
    setAtoll('')
    setMonth('')
    setYear('')
    setMinAmount('')
    setMaxAmount('')

    const params = new URLSearchParams()
    params.set('status', 'pending')
    const currentPerPage = searchParams.get('per_page')
    if (currentPerPage) params.set('per_page', currentPerPage)

    router.push(`/admin/dashboard?${params.toString()}`)
  }

  const hasActiveFilters = hotel || atoll || month || year || minAmount || maxAmount || status !== 'pending'

  // Generate year options (current year and past 2 years)
  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear - 1, currentYear - 2]

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <CardDescription>Filter submissions by various criteria</CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hotel Filter */}
          <div className="space-y-2">
            <Label htmlFor="hotel">Hotel</Label>
            <Select value={hotel || "all"} onValueChange={(val) => setHotel(val === "all" ? "" : val)}>
              <SelectTrigger id="hotel">
                <SelectValue placeholder="All Hotels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hotels</SelectItem>
                {hotels.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Atoll Filter */}
          <div className="space-y-2">
            <Label htmlFor="atoll">Atoll</Label>
            <Select value={atoll || "all"} onValueChange={(val) => setAtoll(val === "all" ? "" : val)}>
              <SelectTrigger id="atoll">
                <SelectValue placeholder="All Atolls" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Atolls</SelectItem>
                {atolls.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month Filter */}
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Select value={month || "all"} onValueChange={(val) => setMonth(val === "all" ? "" : val)}>
              <SelectTrigger id="month">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {MONTHS.map((monthName, index) => (
                  <SelectItem key={index} value={(index + 1).toString()}>
                    {monthName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Filter */}
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select value={year || "all"} onValueChange={(val) => setYear(val === "all" ? "" : val)}>
              <SelectTrigger id="year">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min Amount Filter */}
          <div className="space-y-2">
            <Label htmlFor="minAmount">Min Amount (USD)</Label>
            <Input
              id="minAmount"
              type="number"
              min="0"
              step="100"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="e.g., 1000"
            />
          </div>

          {/* Max Amount Filter */}
          <div className="space-y-2">
            <Label htmlFor="maxAmount">Max Amount (USD)</Label>
            <Input
              id="maxAmount"
              type="number"
              min="0"
              step="100"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="e.g., 5000"
            />
          </div>

          {/* Apply Button */}
          <div className="space-y-2 flex items-end">
            <Button onClick={applyFilters} className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {status !== 'pending' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Status: {status}
              </span>
            )}
            {hotel && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Hotel: {hotels.find(h => h.id === hotel)?.name}
              </span>
            )}
            {atoll && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Atoll: {atoll}
              </span>
            )}
            {month && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Month: {MONTHS[parseInt(month) - 1]}
              </span>
            )}
            {year && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Year: {year}
              </span>
            )}
            {minAmount && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Min: ${parseInt(minAmount).toLocaleString()}
              </span>
            )}
            {maxAmount && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Max: ${parseInt(maxAmount).toLocaleString()}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
