'use client'

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MONTHS } from '@/lib/constants'

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

interface ComparisonChartProps {
  data: HotelData[]
}

// Color palette for up to 3 hotels
const COLORS = [
  { stroke: 'hsl(var(--primary))', fill: 'hsl(var(--primary))', name: 'Hotel 1' },
  { stroke: '#2563eb', fill: '#2563eb', name: 'Hotel 2' },
  { stroke: '#16a34a', fill: '#16a34a', name: 'Hotel 3' },
]

export function ComparisonChart({ data }: ComparisonChartProps) {
  if (data.length === 0) {
    return null
  }

  // Get all unique month-year combinations from all hotels
  const allPeriods = new Set<string>()
  data.forEach(({ records }) => {
    records.forEach((record) => {
      const key = `${record.year}-${String(record.month).padStart(2, '0')}`
      allPeriods.add(key)
    })
  })

  // Sort periods chronologically
  const sortedPeriods = Array.from(allPeriods).sort()

  // Create chart data with all periods
  const chartData = sortedPeriods.map(period => {
    const [year, month] = period.split('-')
    const monthNum = parseInt(month, 10)
    const yearNum = parseInt(year, 10)

    const dataPoint: any = {
      period,
      label: `${MONTHS[monthNum - 1].substring(0, 3)} ${year}`,
    }

    // Add data for each hotel
    data.forEach(({ hotel, records }, index) => {
      const record = records.find(
        r => r.month === monthNum && r.year === yearNum
      )
      dataPoint[`hotel${index}`] = record?.total_usd || null
    })

    return dataPoint
  })

  // Take last 12 months of data
  const recentData = chartData.slice(-12)

  return (
    <Card className="border-2 shadow-xl hover-lift">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Service Charge Comparison
        </CardTitle>
        <CardDescription>
          Compare 12-month service charge trends across selected hotels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={recentData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value: any) => {
                if (value === null) return 'No data'
                return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
              }}
              labelStyle={{ color: '#000', fontWeight: 600 }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            {data.map((hotelData, index) => (
              <Line
                key={hotelData.hotel.id}
                type="monotone"
                dataKey={`hotel${index}`}
                name={hotelData.hotel.name}
                stroke={COLORS[index].stroke}
                strokeWidth={3}
                dot={{ fill: COLORS[index].fill, r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        {/* Legend with hotel details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.map((hotelData, index) => (
            <div
              key={hotelData.hotel.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index].stroke }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{hotelData.hotel.name}</p>
                <p className="text-sm text-muted-foreground">{hotelData.hotel.atoll}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  ${hotelData.stats.averageAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}
                </p>
                <p className="text-xs text-muted-foreground">avg</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
