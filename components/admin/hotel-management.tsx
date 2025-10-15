'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Pencil, Trash2, Building2 } from 'lucide-react'
import { AddHotelDialog } from './add-hotel-dialog'
import { EditHotelDialog } from './edit-hotel-dialog'
import type { Tables } from '@/types/database.types'

type Hotel = Tables<'hotels'>

const ATOLLS = [
  'North Male Atoll',
  'South Male Atoll',
  'Baa Atoll',
  'Lhaviyani Atoll',
  'Ari Atoll',
  'South Ari Atoll',
  'Addu Atoll',
  'Hulhumale',
  'Male',
  'Other',
]

const HOTEL_TYPES = [
  { value: 'resort', label: 'Resort' },
  { value: 'city_hotel', label: 'City Hotel' },
  { value: 'guesthouse', label: 'Guesthouse' },
]

// Helper function to format hotel type for display
const formatHotelType = (type: string) => {
  const typeMap: Record<string, string> = {
    'resort': 'Resort',
    'city_hotel': 'City Hotel',
    'guesthouse': 'Guesthouse',
  }
  return typeMap[type] || type
}

export function HotelManagement() {
  const router = useRouter()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [atollFilter, setAtollFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [hotelToDelete, setHotelToDelete] = useState<Hotel | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch hotels
  const fetchHotels = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (atollFilter && atollFilter !== 'all') params.append('atoll', atollFilter)
      if (typeFilter && typeFilter !== 'all') params.append('type', typeFilter)
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/admin/hotels?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch hotels')

      const data = await response.json()
      setHotels(data.hotels)
      setFilteredHotels(data.hotels)
    } catch (error) {
      console.error('Error fetching hotels:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load hotels on mount and when filters change
  useEffect(() => {
    fetchHotels()
  }, [search, atollFilter, typeFilter, statusFilter])

  // Handle delete
  const handleDelete = async () => {
    if (!hotelToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/hotels/${hotelToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete hotel')

      const data = await response.json()

      // Refresh list
      await fetchHotels()

      setDeleteDialogOpen(false)
      setHotelToDelete(null)
    } catch (error: any) {
      console.error('Error deleting hotel:', error)
      // Error is logged to console, user will see deletion didn't work if hotel still appears
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-xl">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Hotel Management</h2>
            <p className="text-muted-foreground">
              Manage hotels, resorts, and guesthouses
            </p>
          </div>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Hotel
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 rounded-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hotels..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Atoll Filter */}
          <Select value={atollFilter} onValueChange={setAtollFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Atolls" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Atolls</SelectItem>
              {ATOLLS.map((atoll) => (
                <SelectItem key={atoll} value={atoll}>
                  {atoll}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {HOTEL_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Hotels Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Atoll</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Staff Count</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading hotels...
                </TableCell>
              </TableRow>
            ) : filteredHotels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hotels found
                </TableCell>
              </TableRow>
            ) : (
              filteredHotels.map((hotel) => (
                <TableRow key={hotel.id}>
                  <TableCell className="font-semibold">{hotel.name}</TableCell>
                  <TableCell>{hotel.atoll}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{formatHotelType(hotel.type)}</Badge>
                  </TableCell>
                  <TableCell>
                    {hotel.staff_count ? hotel.staff_count.toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={hotel.status === 'active' ? 'default' : 'secondary'}>
                      {hotel.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedHotel(hotel)
                          setEditDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setHotelToDelete(hotel)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Hotel Dialog */}
      <AddHotelDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={fetchHotels}
      />

      {/* Edit Hotel Dialog */}
      {selectedHotel && (
        <EditHotelDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          hotel={selectedHotel}
          onSuccess={fetchHotels}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hotel</AlertDialogTitle>
            <AlertDialogDescription>
              {hotelToDelete && (
                <>
                  Are you sure you want to delete <strong>{hotelToDelete.name}</strong>?
                  {hotelToDelete.status === 'active' && (
                    <span className="block mt-2 text-yellow-600">
                      Note: If this hotel has existing data, it will be marked as &quot;closed&quot; instead of being deleted.
                    </span>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
