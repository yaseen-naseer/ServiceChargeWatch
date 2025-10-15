'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createHotelSchema, type CreateHotelFormData } from '@/lib/validations'
import { Building2 } from 'lucide-react'

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

interface AddHotelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddHotelDialog({ open, onOpenChange, onSuccess }: AddHotelDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateHotelFormData>({
    resolver: zodResolver(createHotelSchema),
    defaultValues: {
      name: '',
      atoll: '',
      type: 'resort',
      staff_count: null,
      status: 'active',
    },
  })

  const selectedType = watch('type')
  const selectedAtoll = watch('atoll')

  const onSubmit = async (data: CreateHotelFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create hotel')
      }

      // Success
      reset()
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error('Error creating hotel:', error)
      setError(error.message || 'Failed to create hotel')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Add New Hotel</DialogTitle>
              <DialogDescription>
                Create a new hotel, resort, or guesthouse entry
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Hotel Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Hotel Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Soneva Fushi"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Atoll */}
          <div className="space-y-2">
            <Label htmlFor="atoll">
              Atoll <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedAtoll}
              onValueChange={(value) => setValue('atoll', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select atoll" />
              </SelectTrigger>
              <SelectContent>
                {ATOLLS.map((atoll) => (
                  <SelectItem key={atoll} value={atoll}>
                    {atoll}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.atoll && (
              <p className="text-sm text-destructive">{errors.atoll.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">
              Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue('type', value as 'resort' | 'city_hotel' | 'guesthouse')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {HOTEL_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Staff Count */}
          <div className="space-y-2">
            <Label htmlFor="staff_count">Staff Count (Optional)</Label>
            <Input
              id="staff_count"
              type="number"
              {...register('staff_count', {
                setValueAs: (value) => {
                  if (value === '' || value == null) return null
                  const num = parseInt(value)
                  return isNaN(num) ? null : num
                },
              })}
              placeholder="e.g., 250"
            />
            {errors.staff_count && (
              <p className="text-sm text-destructive">{errors.staff_count.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Hotel'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
