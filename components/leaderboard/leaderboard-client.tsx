'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Tables } from '@/types/database.types'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { HOTEL_TYPE_LABELS } from '@/lib/constants'

type Hotel = Tables<'hotels'>
type SCRecord = Tables<'sc_records'>

interface LeaderboardEntry extends SCRecord {
  hotels: Hotel
}

interface LeaderboardClientProps {
  data: LeaderboardEntry[]
  currentMonth: string
}

type SortField = 'rank' | 'usd' | 'mvr' | 'total'
type SortDirection = 'asc' | 'desc'

export function LeaderboardClient({ data, currentMonth }: LeaderboardClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAtoll, setFilterAtoll] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('total')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)

  // Extract unique atolls from data
  const atolls = useMemo(() => {
    const uniqueAtolls = new Set(data.map(entry => entry.hotels.atoll))
    return Array.from(uniqueAtolls).sort()
  }, [data])

  // Extract unique types from data
  const types = useMemo(() => {
    const uniqueTypes = new Set(data.map(entry => entry.hotels.type))
    return Array.from(uniqueTypes).sort()
  }, [data])

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(entry =>
        entry.hotels.name.toLowerCase().includes(search) ||
        entry.hotels.atoll.toLowerCase().includes(search)
      )
    }

    // Apply atoll filter
    if (filterAtoll !== 'all') {
      result = result.filter(entry => entry.hotels.atoll === filterAtoll)
    }

    // Apply type filter
    if (filterType !== 'all') {
      result = result.filter(entry => entry.hotels.type === filterType)
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: number
      let bValue: number

      switch (sortField) {
        case 'usd':
          aValue = a.usd_amount
          bValue = b.usd_amount
          break
        case 'mvr':
          aValue = a.mvr_amount || 0
          bValue = b.mvr_amount || 0
          break
        case 'total':
          aValue = a.total_usd || 0
          bValue = b.total_usd || 0
          break
        default:
          return 0
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    })

    return result
  }, [data, searchTerm, filterAtoll, filterType, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterAtoll('all')
    setFilterType('all')
    setSortField('total')
    setSortDirection('desc')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || filterAtoll !== 'all' || filterType !== 'all' || sortField !== 'total' || sortDirection !== 'desc'

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = filteredData.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, filterAtoll, filterType, sortField, sortDirection])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
  }

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
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-6 border-2 shadow-lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Search & Filter</h3>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Atoll Filter */}
            <Select value={filterAtoll} onValueChange={setFilterAtoll}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Atoll" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Atolls</SelectItem>
                {atolls.map(atoll => (
                  <SelectItem key={atoll} value={atoll}>
                    {atoll}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {HOTEL_TYPE_LABELS[type as keyof typeof HOTEL_TYPE_LABELS]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchTerm}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => setSearchTerm('')}
                  />
                </Badge>
              )}
              {filterAtoll !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Atoll: {filterAtoll}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => setFilterAtoll('all')}
                  />
                </Badge>
              )}
              {filterType !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Type: {HOTEL_TYPE_LABELS[filterType as keyof typeof HOTEL_TYPE_LABELS]}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => setFilterType('all')}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Results Count and Per Page Selector */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{startIndex + 1}-{Math.min(endIndex, filteredData.length)}</span> of{' '}
          <span className="font-semibold text-foreground">{filteredData.length}</span> hotels
          {filteredData.length !== data.length && (
            <span className="text-xs"> (filtered from {data.length} total)</span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Per page:</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => {
            setItemsPerPage(parseInt(value))
            setCurrentPage(1)
          }}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Leaderboard Table */}
      {filteredData.length === 0 ? (
        <Card className="p-12 text-center border-2 shadow-lg">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-muted-foreground text-lg mb-2">No hotels match your filters</p>
          <Button variant="outline" onClick={clearFilters} className="mt-4">
            Clear Filters
          </Button>
        </Card>
      ) : (
        <Card className="border-2 shadow-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[80px] font-bold">Rank</TableHead>
                <TableHead className="font-bold">Hotel Name</TableHead>
                <TableHead className="font-bold">Location</TableHead>
                <TableHead className="font-bold">Type</TableHead>
                <TableHead className="text-right font-bold">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('usd')}
                    className="hover:bg-transparent font-bold h-auto p-0 flex items-center ml-auto"
                  >
                    USD Amount
                    <SortIcon field="usd" />
                  </Button>
                </TableHead>
                <TableHead className="text-right font-bold">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('mvr')}
                    className="hover:bg-transparent font-bold h-auto p-0 flex items-center ml-auto"
                  >
                    MVR Amount
                    <SortIcon field="mvr" />
                  </Button>
                </TableHead>
                <TableHead className="text-right font-bold">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('total')}
                    className="hover:bg-transparent font-bold h-auto p-0 flex items-center ml-auto"
                  >
                    Total (USD)
                    <SortIcon field="total" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((entry, index) => {
                const actualIndex = startIndex + index
                return (
                  <TableRow
                    key={entry.id}
                    className={`transition-colors hover:bg-primary/5 ${
                      actualIndex < 3 ? 'bg-gradient-to-r from-primary/5 to-transparent' : ''
                    }`}
                  >
                    <TableCell className="font-bold text-lg">
                      {actualIndex === 0 && <span className="text-2xl">🥇</span>}
                      {actualIndex === 1 && <span className="text-2xl">🥈</span>}
                      {actualIndex === 2 && <span className="text-2xl">🥉</span>}
                      {actualIndex > 2 && <span className="text-muted-foreground">#{actualIndex + 1}</span>}
                    </TableCell>
                    <TableCell className="font-semibold">
                      <Link
                        href={`/hotels/${entry.hotel_id}`}
                        className="hover:underline text-primary transition-colors flex items-center gap-2"
                      >
                        {entry.hotels.name}
                        <span className="text-xs">→</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{entry.hotels.atoll}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {HOTEL_TYPE_LABELS[entry.hotels.type as keyof typeof HOTEL_TYPE_LABELS]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      ${entry.usd_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {entry.mvr_amount
                        ? `MVR ${entry.mvr_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-lg">
                      ${entry.total_usd?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination Controls */}
      {filteredData.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="hover-lift"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {/* First page */}
            {currentPage > 2 && (
              <>
                <Button
                  variant={currentPage === 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  className="w-10"
                >
                  1
                </Button>
                {currentPage > 3 && (
                  <span className="text-muted-foreground px-2">...</span>
                )}
              </>
            )}

            {/* Pages around current */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                return page === currentPage ||
                       page === currentPage - 1 ||
                       page === currentPage + 1
              })
              .map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}

            {/* Last page */}
            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && (
                  <span className="text-muted-foreground px-2">...</span>
                )}
                <Button
                  variant={currentPage === totalPages ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-10"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="hover-lift"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}
