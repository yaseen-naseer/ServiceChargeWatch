'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RejectionReason } from '@/lib/analytics/queries'

interface RejectionReasonsChartProps {
  data: RejectionReason[]
}

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981']

export function RejectionReasonsChart({ data }: RejectionReasonsChartProps) {
  if (data.length === 0) {
    return (
      <Card className="border-2 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <span className="text-2xl">📉</span>
            Rejection Reasons
          </CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No rejections to analyze
          </p>
        </CardContent>
      </Card>
    )
  }

  const totalRejections = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <Card className="border-2 shadow-xl hover-lift">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <span className="text-2xl">📉</span>
          Rejection Reasons
        </CardTitle>
        <CardDescription>
          Breakdown of submission rejection causes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Pie Chart */}
          <div className="w-full md:w-1/2">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data as unknown as Record<string, unknown>[]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.percentage.toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value} rejections`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Reasons List */}
          <div className="w-full md:w-1/2 space-y-2">
            {data.map((reason, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {reason.reason}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{reason.count}</div>
                  <div className="text-xs text-muted-foreground">
                    {reason.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center p-3 rounded-lg bg-red-50">
          <div className="text-sm text-muted-foreground">Total Rejections</div>
          <div className="text-2xl font-bold text-red-600">{totalRejections}</div>
        </div>
      </CardContent>
    </Card>
  )
}
