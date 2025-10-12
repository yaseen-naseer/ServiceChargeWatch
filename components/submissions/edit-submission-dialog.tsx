'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { MONTHS, POSITIONS } from '@/lib/constants'
import type { Tables } from '@/types/database.types'

type Hotel = Tables<'hotels'>
type Submission = Tables<'submissions'>

interface SubmissionWithHotel extends Submission {
  hotels: Hotel
}

interface EditSubmissionDialogProps {
  submission: SubmissionWithHotel
  hotels: Hotel[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditSubmissionDialog({
  submission,
  hotels,
  open,
  onOpenChange,
}: EditSubmissionDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [hotelId, setHotelId] = useState(submission.hotel_id)
  const [month, setMonth] = useState(submission.month.toString())
  const [year, setYear] = useState(submission.year.toString())
  const [usdAmount, setUsdAmount] = useState(submission.usd_amount.toString())
  const [mvrAmount, setMvrAmount] = useState(
    submission.mvr_amount?.toString() || ''
  )
  const [position, setPosition] = useState(submission.position || '')
  const [proofUrl, setProofUrl] = useState(submission.proof_url || '')

  // Reset form when submission changes
  useEffect(() => {
    setHotelId(submission.hotel_id)
    setMonth(submission.month.toString())
    setYear(submission.year.toString())
    setUsdAmount(submission.usd_amount.toString())
    setMvrAmount(submission.mvr_amount?.toString() || '')
    setPosition(submission.position || '')
    setProofUrl(submission.proof_url || '')
  }, [submission])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/submissions/${submission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotel_id: hotelId,
          month: parseInt(month),
          year: parseInt(year),
          usd_amount: parseFloat(usdAmount),
          mvr_amount: mvrAmount ? parseFloat(mvrAmount) : null,
          position,
          proof_url: proofUrl || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update submission')
      }

      toast.success('Submission updated successfully')
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error('Update error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to update submission'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate year options (current year and past 2 years)
  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear - 1, currentYear - 2]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Submission</DialogTitle>
          <DialogDescription>
            Update your pending service charge submission. You can only edit
            submissions that haven't been reviewed yet.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hotel Selection */}
          <div className="space-y-2">
            <Label htmlFor="hotel">Hotel *</Label>
            <Select value={hotelId} onValueChange={setHotelId} required>
              <SelectTrigger id="hotel">
                <SelectValue placeholder="Select hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((hotel) => (
                  <SelectItem key={hotel.id} value={hotel.id}>
                    {hotel.name} - {hotel.atoll}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Period Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Month *</Label>
              <Select value={month} onValueChange={setMonth} required>
                <SelectTrigger id="month">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((monthName, index) => (
                    <SelectItem key={index} value={(index + 1).toString()}>
                      {monthName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Select value={year} onValueChange={setYear} required>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="usd_amount">USD Amount *</Label>
              <Input
                id="usd_amount"
                type="number"
                step="0.01"
                min="0"
                value={usdAmount}
                onChange={(e) => setUsdAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mvr_amount">MVR Amount (Optional)</Label>
              <Input
                id="mvr_amount"
                type="number"
                step="0.01"
                min="0"
                value={mvrAmount}
                onChange={(e) => setMvrAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position">Your Position *</Label>
            <Select value={position} onValueChange={setPosition} required>
              <SelectTrigger id="position">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Proof URL */}
          <div className="space-y-2">
            <Label htmlFor="proof_url">Proof URL (Optional)</Label>
            <Input
              id="proof_url"
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://example.com/proof.jpg"
            />
            <p className="text-sm text-muted-foreground">
              Link to proof document (e.g., payslip screenshot hosted on Imgur, Google
              Drive, etc.)
            </p>
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
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
