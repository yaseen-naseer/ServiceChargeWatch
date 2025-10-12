'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2, Upload } from 'lucide-react'
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { submissionSchema, type SubmissionFormData } from '@/lib/validations'
import { MONTHS } from '@/lib/constants'
import type { Tables } from '@/types/database.types'

type Hotel = Tables<'hotels'>

interface SubmissionFormProps {
  hotels: Hotel[]
  userEmail?: string
}

export function SubmissionForm({ hotels, userEmail }: SubmissionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  })

  const selectedFile = watch('proofFile')

  const onSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('hotelId', data.hotelId)
      formData.append('month', data.month.toString())
      formData.append('year', data.year.toString())
      formData.append('usdAmount', data.usdAmount.toString())
      if (data.mvrAmount) formData.append('mvrAmount', data.mvrAmount.toString())
      formData.append('position', data.position)
      if (data.proofFile) formData.append('proofFile', data.proofFile)

      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-2">Submission Received!</h3>
            <p className="text-muted-foreground mb-4">
              Thank you for contributing to transparency. Your submission will be reviewed by our admin team.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to homepage...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit Service Charge Data</CardTitle>
        <CardDescription>
          Help build transparency by sharing your hotel&apos;s service charge information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Hotel Selection */}
          <div className="space-y-2">
            <Label htmlFor="hotelId">Hotel Name *</Label>
            <Select onValueChange={(value) => setValue('hotelId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your hotel" />
              </SelectTrigger>
              <SelectContent>
                {hotels.map((hotel) => (
                  <SelectItem key={hotel.id} value={hotel.id}>
                    {hotel.name} - {hotel.atoll}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.hotelId && (
              <p className="text-sm text-destructive">{errors.hotelId.message}</p>
            )}
          </div>

          {/* Month and Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Month *</Label>
              <Select
                onValueChange={(value) => setValue('month', parseInt(value))}
                defaultValue={new Date().getMonth() + 1 + ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month, index) => (
                    <SelectItem key={month} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.month && (
                <p className="text-sm text-destructive">{errors.month.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                {...register('year', { valueAsNumber: true })}
                placeholder="2025"
              />
              {errors.year && (
                <p className="text-sm text-destructive">{errors.year.message}</p>
              )}
            </div>
          </div>

          {/* USD Amount */}
          <div className="space-y-2">
            <Label htmlFor="usdAmount">Primary Service Charge (USD) *</Label>
            <Input
              id="usdAmount"
              type="number"
              step="0.01"
              {...register('usdAmount', { valueAsNumber: true })}
              placeholder="2500.00"
            />
            {errors.usdAmount && (
              <p className="text-sm text-destructive">{errors.usdAmount.message}</p>
            )}
          </div>

          {/* MVR Amount (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="mvrAmount">Secondary Service Charge (MVR) - Optional</Label>
            <Input
              id="mvrAmount"
              type="number"
              step="0.01"
              {...register('mvrAmount', { valueAsNumber: true })}
              placeholder="15000.00"
            />
            {errors.mvrAmount && (
              <p className="text-sm text-destructive">{errors.mvrAmount.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Some hotels pay service charge in both USD and MVR
            </p>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position">Your Position *</Label>
            <Input
              id="position"
              {...register('position')}
              placeholder="e.g., Waiter, Receptionist, Chef"
            />
            {errors.position && (
              <p className="text-sm text-destructive">{errors.position.message}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="proofFile">Proof (Payslip Photo) - Optional</Label>
            <div className="flex items-center gap-4">
              <Input
                id="proofFile"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setValue('proofFile', file)
                }}
                className="cursor-pointer"
              />
              {selectedFile && (
                <Upload className="h-5 w-5 text-green-600" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a photo of your payslip. Blur any personal information before uploading.
            </p>
          </div>

          {/* User Email Display */}
          {userEmail && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Submitting as:</span> {userEmail}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Service Charge Data'
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your submission will be reviewed by our admin team before being published
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
