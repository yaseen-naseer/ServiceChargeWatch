'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle2, Clock, XCircle, AlertCircle, Edit, Trash2 } from 'lucide-react'
import { EditSubmissionDialog } from './edit-submission-dialog'
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
import { toast } from 'sonner'
import type { Tables } from '@/types/database.types'
import { HOTEL_TYPE_LABELS } from '@/lib/constants'

type Hotel = Tables<'hotels'>
type Submission = Tables<'submissions'>

interface SubmissionWithHotel extends Submission {
  hotels: Hotel
}

interface SubmissionHistoryProps {
  submissions: SubmissionWithHotel[]
  userEmail: string
  hotels: Hotel[]
}

export function SubmissionHistory({ submissions, userEmail, hotels }: SubmissionHistoryProps) {
  const router = useRouter()
  const [editingSubmission, setEditingSubmission] = useState<SubmissionWithHotel | null>(null)
  const [deletingSubmissionId, setDeletingSubmissionId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (submissionId: string) => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete submission')
      }

      toast.success('Submission deleted successfully')
      setDeletingSubmissionId(null)
      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete submission'
      )
    } finally {
      setIsDeleting(false)
    }
  }
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        )
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return '✅'
      case 'pending':
        return '⏳'
      case 'rejected':
        return '❌'
      default:
        return '📝'
    }
  }

  const stats = {
    total: submissions.length,
    verified: submissions.filter(s => s.status === 'verified').length,
    pending: submissions.filter(s => s.status === 'pending').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  }

  if (submissions.length === 0) {
    return (
      <Card className="p-12 text-center border-2 shadow-lg">
        <div className="text-6xl mb-4">📭</div>
        <CardTitle className="text-2xl mb-2">No Submissions Yet</CardTitle>
        <CardDescription className="text-lg mb-6">
          You haven't submitted any service charge data yet. Start contributing to help build transparency!
        </CardDescription>
        <Button asChild className="gradient-primary text-white shadow-lg hover-lift border-0">
          <Link href="/submit">Submit Your First Entry</Link>
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-lift border-2 shadow-lg">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium">Total Submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {stats.total}
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-2 shadow-lg border-green-200 bg-green-50/50">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium text-green-800">✅ Verified</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-700">
              {stats.verified}
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-2 shadow-lg border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium text-yellow-800">⏳ Pending</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-yellow-700">
              {stats.pending}
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift border-2 shadow-lg border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardDescription className="text-sm font-medium text-red-800">❌ Rejected</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-700">
              {stats.rejected}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Info Alert */}
      <Alert className="bg-primary/5 border-primary/20">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Submissions are reviewed by our admin team for accuracy.
          Verified submissions appear on the public leaderboard anonymously. Your email ({userEmail}) is never shared publicly.
        </AlertDescription>
      </Alert>

      {/* Submissions Table */}
      <Card className="border-2 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Your Submissions
          </CardTitle>
          <CardDescription>
            All your service charge data submissions and their review status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Hotel</TableHead>
                  <TableHead className="font-bold">Period</TableHead>
                  <TableHead className="font-bold">Location</TableHead>
                  <TableHead className="text-right font-bold">USD Amount</TableHead>
                  <TableHead className="text-right font-bold">MVR Amount</TableHead>
                  <TableHead className="font-bold">Submitted</TableHead>
                  <TableHead className="font-bold">Reviewed</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id} className="hover:bg-primary/5">
                    <TableCell>
                      {getStatusBadge(submission.status)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      <div className="flex flex-col">
                        <span>{submission.hotels.name}</span>
                        <Badge variant="outline" className="w-fit text-xs mt-1">
                          {HOTEL_TYPE_LABELS[submission.hotels.type as keyof typeof HOTEL_TYPE_LABELS]}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {format(new Date(submission.year, submission.month - 1), 'MMM yyyy')}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {submission.hotels.atoll}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      ${submission.usd_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {submission.mvr_amount
                        ? `MVR ${submission.mvr_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(submission.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {submission.reviewed_at
                        ? format(new Date(submission.reviewed_at), 'MMM dd, yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {submission.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingSubmission(submission)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeletingSubmissionId(submission.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Rejection reasons if any */}
          {submissions.some(s => s.status === 'rejected' && s.rejection_reason) && (
            <div className="p-6 border-t bg-red-50/30">
              <h3 className="font-semibold text-sm mb-4 text-red-900">Rejection Reasons:</h3>
              <div className="space-y-3">
                {submissions
                  .filter(s => s.status === 'rejected' && s.rejection_reason)
                  .map(submission => (
                    <Alert key={submission.id} variant="destructive">
                      <AlertDescription className="text-sm">
                        <strong>{submission.hotels.name}</strong> ({format(new Date(submission.year, submission.month - 1), 'MMM yyyy')}):{' '}
                        {submission.rejection_reason}
                      </AlertDescription>
                    </Alert>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="p-8 hover-lift border-2 shadow-lg gradient-bg">
        <div className="text-center">
          <div className="text-4xl mb-4">💼</div>
          <h3 className="text-2xl font-bold mb-2">Submit More Data</h3>
          <p className="text-muted-foreground mb-6">
            Have more service charge information to share? Help us build a comprehensive database!
          </p>
          <Button asChild className="gradient-primary text-white shadow-lg hover-lift border-0">
            <Link href="/submit">Submit New Entry →</Link>
          </Button>
        </div>
      </Card>

      {/* Edit Dialog */}
      {editingSubmission && (
        <EditSubmissionDialog
          submission={editingSubmission}
          hotels={hotels}
          open={!!editingSubmission}
          onOpenChange={(open) => !open && setEditingSubmission(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingSubmissionId}
        onOpenChange={(open) => !open && setDeletingSubmissionId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingSubmissionId && handleDelete(deletingSubmissionId)}
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
