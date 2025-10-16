import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { HOTEL_TYPE_LABELS } from '@/lib/constants'
import type { Tables } from '@/types/database.types'

type Hotel = Tables<'hotels'>
type SCRecord = Tables<'sc_records'>

interface LeaderboardEntry extends SCRecord {
  hotels: Hotel
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[]
  currentMonth: string
}

export function LeaderboardTable({ data, currentMonth }: LeaderboardTableProps) {
  if (data.length === 0) {
    return (
      <Card className="p-12 text-center border-2 shadow-lg">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-muted-foreground text-lg">
          No service charge data available for {currentMonth}.
        </p>
      </Card>
    )
  }

  return (
    <Card className="border-2 shadow-xl overflow-hidden">
      {/* Mobile: Horizontal scroll wrapper */}
      <div className="overflow-x-auto -mx-px">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[80px] font-bold sticky left-0 bg-muted/50 z-10">Rank</TableHead>
              <TableHead className="font-bold min-w-[200px] sticky left-[80px] bg-muted/50 z-10">Hotel Name</TableHead>
              <TableHead className="font-bold hidden md:table-cell">Location</TableHead>
              <TableHead className="font-bold hidden lg:table-cell">Type</TableHead>
              <TableHead className="text-right font-bold hidden sm:table-cell min-w-[120px]">USD Amount</TableHead>
              <TableHead className="text-right font-bold hidden md:table-cell min-w-[120px]">MVR Amount</TableHead>
              <TableHead className="text-right font-bold min-w-[140px]">Total (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry, index) => (
              <TableRow
                key={entry.id}
                className={`transition-colors hover:bg-primary/5 ${
                  index < 3 ? 'bg-gradient-to-r from-primary/5 to-transparent' : ''
                }`}
              >
                <TableCell className="font-bold text-lg sticky left-0 bg-background z-10">
                  {index === 0 && <span className="text-2xl">🥇</span>}
                  {index === 1 && <span className="text-2xl">🥈</span>}
                  {index === 2 && <span className="text-2xl">🥉</span>}
                  {index > 2 && <span className="text-muted-foreground">#{index + 1}</span>}
                </TableCell>
                <TableCell className="font-semibold sticky left-[80px] bg-background z-10">
                  <Link
                    href={`/hotels/${entry.hotel_id}`}
                    className="hover:underline text-primary transition-colors flex items-center gap-2 min-h-[44px] -my-2 py-2"
                  >
                    {entry.hotels.name}
                    <span className="text-xs">→</span>
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">{entry.hotels.atoll}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="secondary" className="font-medium">
                    {HOTEL_TYPE_LABELS[entry.hotels.type as keyof typeof HOTEL_TYPE_LABELS]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono font-medium hidden sm:table-cell">
                  ${entry.usd_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right font-mono text-muted-foreground hidden md:table-cell">
                  {entry.mvr_amount
                    ? `MVR ${entry.mvr_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    : '-'}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-lg">
                  ${entry.total_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
