'use client'

import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ApprovalTimeData } from '@/lib/analytics/queries'

interface ApprovalTimeMetricsProps {
  data: ApprovalTimeData
}

export function ApprovalTimeMetrics({ data }: ApprovalTimeMetricsProps) {
  const hasData = data.averageHours > 0

  return (
    <Card className="border-2 shadow-xl hover-lift">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <span className="text-2xl">⏱️</span>
          Approval Time Analysis
        </CardTitle>
        <CardDescription>
          Time taken from submission to approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className="text-muted-foreground text-center py-8">
            No approval time data available
          </p>
        ) : (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <div className="text-sm text-muted-foreground">Average</div>
                <div className="text-2xl font-bold text-primary">
                  {data.averageHours.toFixed(1)}h
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <div className="text-sm text-muted-foreground">Median</div>
                <div className="text-2xl font-bold text-primary">
                  {data.medianHours.toFixed(1)}h
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-50">
                <div className="text-sm text-muted-foreground">Fastest</div>
                <div className="text-xl font-bold text-green-600">
                  {data.fastestHours.toFixed(1)}h
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-50">
                <div className="text-sm text-muted-foreground">Slowest</div>
                <div className="text-xl font-bold text-orange-600">
                  {data.slowestHours.toFixed(1)}h
                </div>
              </div>
            </div>

            {/* Trend Chart */}
            {data.byMonth.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3">Monthly Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data.byMonth}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      tickFormatter={(value) => `${value.toFixed(0)}h`}
                    />
                    <Tooltip
                      formatter={(value: number) => `${value.toFixed(1)} hours`}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="averageHours"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                      name="Avg Hours"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
