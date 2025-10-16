'use client'

import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SubmissionPattern } from '@/lib/analytics/queries'

interface SubmissionPatternsChartProps {
  data: SubmissionPattern[]
}

export function SubmissionPatternsChart({ data }: SubmissionPatternsChartProps) {
  if (data.length === 0) {
    return (
      <Card className="border-2 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <span className="text-2xl">📅</span>
            Submission Patterns
          </CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No submissions to analyze
          </p>
        </CardContent>
      </Card>
    )
  }

  // Format dates for better display
  const formattedData = data.map(d => ({
    ...d,
    dateLabel: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))

  const totalSubmissions = data.reduce((sum, d) => sum + d.count, 0)
  const avgPerDay = totalSubmissions / data.length

  return (
    <Card className="border-2 shadow-xl hover-lift">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <span className="text-2xl">📅</span>
          Submission Patterns
        </CardTitle>
        <CardDescription>
          Daily submission activity over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="approved" stackId="a" fill="#16a34a" name="Approved" />
            <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
            <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rejected" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-primary/5">
            <div className="text-sm text-muted-foreground">Total (30 days)</div>
            <div className="text-2xl font-bold text-primary">{totalSubmissions}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-primary/5">
            <div className="text-sm text-muted-foreground">Avg Per Day</div>
            <div className="text-2xl font-bold text-primary">{avgPerDay.toFixed(1)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
