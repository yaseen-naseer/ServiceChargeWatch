'use client'

import Link from 'next/link'
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

interface ComparisonTableProps {
  data: HotelData[]
}

export function ComparisonTable({ data }: ComparisonTableProps) {
  if (data.length === 0) {
    return null
  }

  // Calculate trends
  const trends = data.map(({ records }) => {
    if (records.length < 2) return 'stable'
    const latestAmount = records[0]?.total_usd || 0
    const previousAmount = records[1]?.total_usd || 0
    const percentChange = ((latestAmount - previousAmount) / previousAmount) * 100

    if (percentChange > 2) return 'up'
    else if (percentChange < -2) return 'down'
    return 'stable'
  })

  // Find best values
  const highestCurrent = Math.max(...data.map(d => d.stats.currentAmount))
  const highestAverage = Math.max(...data.map(d => d.stats.averageAmount))
  const highestPeak = Math.max(...data.map(d => d.stats.highestAmount))

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Detailed Comparison
        </CardTitle>
        <CardDescription>
          Side-by-side comparison of key service charge metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-px">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] min-w-[150px] sticky left-0 bg-muted/50 z-10">Metric</TableHead>
                {data.map(({ hotel }) => (
                  <TableHead key={hotel.id} className="text-center min-w-[180px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold text-sm sm:text-base">{hotel.name}</span>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          {hotel.atoll}
                        </Badge>
                      </div>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Hotel Type */}
              <TableRow>
                <TableCell className="font-medium sticky left-0 bg-background z-10">Hotel Type</TableCell>
                {data.map(({ hotel }) => (
                  <TableCell key={hotel.id} className="text-center">
                    <Badge variant="secondary">
                      {HOTEL_TYPE_LABELS[hotel.type as keyof typeof HOTEL_TYPE_LABELS]}
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>

              {/* Staff Count */}
              <TableRow>
                <TableCell className="font-medium sticky left-0 bg-background z-10">Staff Members</TableCell>
                {data.map(({ hotel }) => (
                  <TableCell key={hotel.id} className="text-center">
                    {hotel.staff_count ? `~${hotel.staff_count}` : 'N/A'}
                  </TableCell>
                ))}
              </TableRow>

              {/* Current Month */}
              <TableRow className="bg-muted/30">
                <TableCell className="font-medium sticky left-0 bg-background z-10">Current Month SC</TableCell>
                {data.map(({ stats, hotel }) => (
                  <TableCell
                    key={hotel.id}
                    className={`text-center font-semibold ${
                      stats.currentAmount === highestCurrent
                        ? 'text-primary'
                        : ''
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>
                        ${stats.currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      {stats.currentAmount === highestCurrent && (
                        <Badge variant="default" className="text-xs">
                          Highest
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* Trend */}
              <TableRow>
                <TableCell className="font-medium sticky left-0 bg-background z-10">Trend</TableCell>
                {trends.map((trend, index) => (
                  <TableCell key={index} className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {trend === 'up' && (
                        <>
                          <ArrowUpIcon className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">Increasing</span>
                        </>
                      )}
                      {trend === 'down' && (
                        <>
                          <ArrowDownIcon className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">Decreasing</span>
                        </>
                      )}
                      {trend === 'stable' && (
                        <>
                          <MinusIcon className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-600">Stable</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* 12-Month Average */}
              <TableRow className="bg-muted/30">
                <TableCell className="font-medium sticky left-0 bg-background z-10">12-Month Average</TableCell>
                {data.map(({ stats, hotel }) => (
                  <TableCell
                    key={hotel.id}
                    className={`text-center font-semibold ${
                      stats.averageAmount === highestAverage
                        ? 'text-primary'
                        : ''
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>
                        ${stats.averageAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      {stats.averageAmount === highestAverage && (
                        <Badge variant="default" className="text-xs">
                          Highest
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* Highest Payment */}
              <TableRow>
                <TableCell className="font-medium sticky left-0 bg-background z-10">Highest Payment</TableCell>
                {data.map(({ stats, hotel }) => (
                  <TableCell
                    key={hotel.id}
                    className={`text-center ${
                      stats.highestAmount === highestPeak
                        ? 'text-green-600 font-semibold'
                        : 'text-green-600'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>
                        ${stats.highestAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      {stats.highestAmount === highestPeak && (
                        <Badge variant="default" className="text-xs bg-green-600">
                          Peak
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>

              {/* Lowest Payment */}
              <TableRow>
                <TableCell className="font-medium sticky left-0 bg-background z-10">Lowest Payment</TableCell>
                {data.map(({ stats, hotel }) => (
                  <TableCell key={hotel.id} className="text-center text-orange-600">
                    ${stats.lowestAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                ))}
              </TableRow>

              {/* Data Points */}
              <TableRow>
                <TableCell className="font-medium sticky left-0 bg-background z-10">Data Points</TableCell>
                {data.map(({ records, hotel }) => (
                  <TableCell key={hotel.id} className="text-center">
                    {records.length} months
                  </TableCell>
                ))}
              </TableRow>

              {/* View Details */}
              <TableRow>
                <TableCell className="font-medium sticky left-0 bg-background z-10">Details</TableCell>
                {data.map(({ hotel }) => (
                  <TableCell key={hotel.id} className="text-center">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/hotels/${hotel.id}`}>
                        View Profile
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
