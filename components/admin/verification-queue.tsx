'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Check, X, Eye, Loader2, CheckSquare, XSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { MONTHS } from '@/lib/constants'
import { toast } from 'sonner'
import type { Tables } from '@/types/database.types'

type Submission = Tables<'submissions'> & {
  hotels: Tables<'hotels'>
}

interface VerificationQueueProps {
  submissions: Submission[]
  currentPage: number
  perPage: number
  totalCount: number
}

export function VerificationQueue({ submissions: initialSubmissions, currentPage, perPage, totalCount }: VerificationQueueProps) {
  const router = useRouter()
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const totalPages = Math.ceil(totalCount / perPage)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve')
  const [rejectionReason, setRejectionReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isBulkProcessing, setIsBulkProcessing] = useState(false)

  const handleReview = async () => {
    if (!selectedSubmission) return

    setIsProcessing(true)

    try {
      const response = await fetch('/api/admin/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          action: reviewAction,
          rejectionReason: reviewAction === 'reject' ? rejectionReason : null,
        }),
      })

      if (!response.ok) throw new Error('Failed to review submission')

      // Remove from queue
      setSubmissions(submissions.filter(s => s.id !== selectedSubmission.id))
      setIsReviewDialogOpen(false)
      setSelectedSubmission(null)
      setRejectionReason('')
      router.refresh()
    } catch (error) {
      console.error('Review error:', error)
      alert('Failed to process review')
    } finally {
      setIsProcessing(false)
    }
  }

  const openReviewDialog = (submission: Submission, action: 'approve' | 'reject') => {
    setSelectedSubmission(submission)
    setReviewAction(action)
    setIsReviewDialogOpen(true)
  }

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === submissions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(submissions.map(s => s.id)))
    }
  }

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedIds.size === 0) {
      toast.error('No submissions selected')
      return
    }

    if (action === 'reject' && !rejectionReason) {
      toast.error('Please provide a rejection reason')
      return
    }

    setIsBulkProcessing(true)

    try {
      const response = await fetch('/api/admin/bulk-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionIds: Array.from(selectedIds),
          action,
          rejectionReason: action === 'reject' ? rejectionReason : null,
        }),
      })

      if (!response.ok) throw new Error('Failed to process bulk action')

      const result = await response.json()

      // Remove processed submissions from queue
      setSubmissions(submissions.filter(s => !selectedIds.has(s.id)))
      setSelectedIds(new Set())
      setRejectionReason('')

      toast.success(`Successfully ${action}d ${result.count} submission(s)`)
      router.refresh()
    } catch (error) {
      console.error('Bulk action error:', error)
      toast.error(`Failed to ${action} submissions`)
    } finally {
      setIsBulkProcessing(false)
    }
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No pending submissions to review</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-2 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="text-2xl">📋</span>
                Pending Submissions ({submissions.length})
              </CardTitle>
              <CardDescription>Review and verify service charge submissions</CardDescription>
            </div>
            {selectedIds.size > 0 && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleBulkAction('approve')}
                  disabled={isBulkProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isBulkProcessing ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <CheckSquare className="h-4 w-4 mr-1" />
                  )}
                  Approve {selectedIds.size}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('reject')}
                  disabled={isBulkProcessing}
                >
                  {isBulkProcessing ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <XSquare className="h-4 w-4 mr-1" />
                  )}
                  Reject {selectedIds.size}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile: Horizontal scroll wrapper */}
          <div className="overflow-x-auto -mx-px">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-12 sticky left-0 bg-muted/50 z-10">
                    <Checkbox
                      checked={selectedIds.size === submissions.length && submissions.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-bold min-w-[150px] sticky left-12 bg-muted/50 z-10">Hotel</TableHead>
                  <TableHead className="min-w-[100px]">Period</TableHead>
                  <TableHead className="min-w-[120px]">Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Submitter</TableHead>
                  <TableHead className="hidden lg:table-cell">Position</TableHead>
                  <TableHead className="hidden sm:table-cell">Submitted</TableHead>
                  <TableHead className="hidden md:table-cell">Proof</TableHead>
                  <TableHead className="min-w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id} className="hover:bg-primary/5">
                    <TableCell className="sticky left-0 bg-background z-10">
                      <Checkbox
                        checked={selectedIds.has(submission.id)}
                        onCheckedChange={() => toggleSelection(submission.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium sticky left-12 bg-background z-10">{submission.hotels.name}</TableCell>
                    <TableCell>
                      {MONTHS[submission.month - 1]} {submission.year}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-mono text-sm">
                          USD ${submission.usd_amount.toLocaleString()}
                        </div>
                        {submission.mvr_amount && (
                          <div className="font-mono text-sm text-muted-foreground">
                            MVR {submission.mvr_amount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm hidden md:table-cell">{submission.submitter_email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{submission.position}</TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                      {format(new Date(submission.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {submission.proof_url ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a href={submission.proof_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">No proof</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => openReviewDialog(submission, 'approve')}
                          className="min-h-[44px]"
                        >
                          <Check className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Approve</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openReviewDialog(submission, 'reject')}
                          className="min-h-[44px]"
                        >
                          <X className="h-4 w-4 sm:mr-1" />
                          <span className="hidden sm:inline">Reject</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between px-2">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min((currentPage - 1) * perPage + 1, totalCount)} to{' '}
                {Math.min(currentPage * perPage, totalCount)} of {totalCount} submissions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/dashboard?page=${currentPage - 1}&per_page=${perPage}`)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => router.push(`/admin/dashboard?page=${pageNum}&per_page=${perPage}`)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/dashboard?page=${currentPage + 1}&per_page=${perPage}`)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Submission
            </DialogTitle>
            <DialogDescription>
              {selectedSubmission && (
                <>
                  {selectedSubmission.hotels.name} - {MONTHS[selectedSubmission.month - 1]}{' '}
                  {selectedSubmission.year}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {reviewAction === 'approve' ? (
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                This will create a verified service charge record and make it visible on the public leaderboard.
              </p>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">USD Amount:</span>
                  <span className="font-mono">${selectedSubmission?.usd_amount.toLocaleString()}</span>
                </div>
                {selectedSubmission?.mvr_amount && (
                  <div className="flex justify-between">
                    <span className="font-semibold">MVR Amount:</span>
                    <span className="font-mono">MVR {selectedSubmission.mvr_amount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <Label htmlFor="rejectionReason">Reason for Rejection *</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this submission..."
                rows={4}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsReviewDialogOpen(false)
                setRejectionReason('')
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReview}
              disabled={isProcessing || (reviewAction === 'reject' && !rejectionReason)}
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Confirm {reviewAction === 'approve' ? 'Approval' : 'Rejection'}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
