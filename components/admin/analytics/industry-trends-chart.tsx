'use client'

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Area, AreaChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IndustryTrendDataPoint } from '@/lib/analytics/queries'

interface IndustryTrendsChartProps {
  data: IndustryTrendDataPoint[]
}

export function IndustryTrendsChart({ data }: IndustryTrendsChartProps) {
  if (data.length === 0) {
    return (
      <Card className="border-2 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <span className="text-2xl">📈</span>
            Industry Trends
          </CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Not enough data to display industry trends
          </p>
        </CardContent>
      </Card>
    )
  }

  // Calculate overall stats
  const overallAverage = data.reduce((sum, d) => sum + d.averageSC, 0) / data.length
  const currentAverage = data[data.length - 1]?.averageSC || 0
  const previousAverage = data[data.length - 2]?.averageSC || currentAverage
  const trend = currentAverage > previousAverage ? 'up' : currentAverage < previousAverage ? 'down' : 'stable'
  const trendPercent = previousAverage > 0
    ? (((currentAverage - previousAverage) / previousAverage) * 100).toFixed(1)
    : '0'

  return (
    <Card className="border-2 shadow-xl hover-lift">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <span className="text-2xl">📈</span>
              Industry Service Charge Trends
            </CardTitle>
            <CardDescription>
              12-month average service charge trends across all hotels
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Overall Average</div>
            <div className="text-2xl font-bold text-primary">
              ${overallAverage.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className={`text-sm ${
              trend === 'up' ? 'text-green-600' :
              trend === 'down' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trend === 'stable' && '→'}
              {' '}
              {trendPercent}% vs prev month
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHighest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLowest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ea580c" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
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
            <Area
              type="monotone"
              dataKey="averageSC"
              stroke="hsl(var(--primary))"
              fill="url(#colorAverage)"
              name="Industry Average"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="highestSC"
              stroke="#16a34a"
              name="Highest"
              strokeWidth={2}
              dot={{ fill: '#16a34a', r: 3 }}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="lowestSC"
              stroke="#ea580c"
              name="Lowest"
              strokeWidth={2}
              dot={{ fill: '#ea580c', r: 3 }}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Stats below chart */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-primary/5">
            <div className="text-sm text-muted-foreground">Hotels Reporting</div>
            <div className="text-xl font-bold text-primary">
              {data[data.length - 1]?.totalHotels || 0}
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50">
            <div className="text-sm text-muted-foreground">Peak Average</div>
            <div className="text-xl font-bold text-green-600">
              ${Math.max(...data.map(d => d.averageSC)).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-orange-50">
            <div className="text-sm text-muted-foreground">Low Average</div>
            <div className="text-xl font-bold text-orange-600">
              ${Math.min(...data.map(d => d.averageSC)).toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
