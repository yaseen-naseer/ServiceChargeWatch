'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TopContributor } from '@/lib/analytics/queries'

interface TopContributorsProps {
  data: TopContributor[]
}

export function TopContributors({ data }: TopContributorsProps) {
  if (data.length === 0) {
    return (
      <Card className="border-2 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            Top Contributors
          </CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No contributors to display
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 shadow-xl hover-lift">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          Top Contributors
        </CardTitle>
        <CardDescription>
          Most active users by submission count
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((contributor, index) => (
            <div
              key={contributor.userId}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-100 text-gray-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-primary/10 text-primary'
                }`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </div>
                <div>
                  <div className="font-medium">{contributor.email}</div>
                  <div className="text-sm text-muted-foreground">
                    {contributor.totalSubmissions} submissions
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ✓ {contributor.approvedCount}
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  ⏳ {contributor.pendingCount}
                </Badge>
                {contributor.rejectedCount > 0 && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    ✗ {contributor.rejectedCount}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
