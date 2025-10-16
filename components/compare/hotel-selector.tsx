'use client'

import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { HOTEL_TYPE_LABELS } from '@/lib/constants'

interface Hotel {
  id: string
  name: string
  atoll: string
  type: string
  staff_count: number | null
}

interface HotelSelectorProps {
  hotels: Hotel[]
  selectedHotelIds: string[]
  onSelectHotel: (hotelId: string) => void
  maxSelections: number
}

export function HotelSelector({
  hotels,
  selectedHotelIds,
  onSelectHotel,
  maxSelections,
}: HotelSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const availableHotels = hotels.filter(hotel => !selectedHotelIds.includes(hotel.id))
  const filteredHotels = availableHotels.filter(hotel =>
    hotel.name.toLowerCase().includes(search.toLowerCase()) ||
    hotel.atoll.toLowerCase().includes(search.toLowerCase())
  )

  const isMaxSelected = selectedHotelIds.length >= maxSelections

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start"
          disabled={isMaxSelected}
        >
          <Plus className="mr-2 h-4 w-4" />
          {isMaxSelected
            ? `Maximum ${maxSelections} hotels selected`
            : `Add hotel to compare (${selectedHotelIds.length}/${maxSelections})`
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search hotels..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No hotels found.</CommandEmpty>
            <CommandGroup>
              {filteredHotels.map((hotel) => (
                <CommandItem
                  key={hotel.id}
                  value={hotel.id}
                  onSelect={() => {
                    onSelectHotel(hotel.id)
                    setOpen(false)
                    setSearch('')
                  }}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="font-medium">{hotel.name}</div>
                    <div className="text-sm text-muted-foreground flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {hotel.atoll}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {HOTEL_TYPE_LABELS[hotel.type as keyof typeof HOTEL_TYPE_LABELS]}
                      </Badge>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
