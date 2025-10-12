'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { UserPlus, Trash2, Shield, Loader2, AlertTriangle } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { Tables } from '@/types/database.types'

type AdminUser = Tables<'admin_users'>

interface AdminUserManagementProps {
  initialAdmins: AdminUser[]
  currentUserId: string
}

export function AdminUserManagement({ initialAdmins, currentUserId }: AdminUserManagementProps) {
  const router = useRouter()
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAddAdmin = async () => {
    if (!newAdminEmail) {
      toast.error('Please enter an email address')
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newAdminEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add admin user')
      }

      toast.success('Admin user added successfully')
      setNewAdminEmail('')
      setIsAddDialogOpen(false)
      router.refresh()

      // Refresh admin list
      const refreshResponse = await fetch('/api/admin/users')
      const refreshedAdmins = await refreshResponse.json()
      setAdmins(refreshedAdmins)
    } catch (error: any) {
      console.error('Add admin error:', error)
      toast.error(error.message || 'Failed to add admin user')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemoveAdmin = async () => {
    if (!selectedAdmin) return

    setIsProcessing(true)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: selectedAdmin.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove admin user')
      }

      toast.success('Admin user removed successfully')
      setSelectedAdmin(null)
      setIsRemoveDialogOpen(false)
      router.refresh()

      // Refresh admin list
      const refreshResponse = await fetch('/api/admin/users')
      const refreshedAdmins = await refreshResponse.json()
      setAdmins(refreshedAdmins)
    } catch (error: any) {
      console.error('Remove admin error:', error)
      toast.error(error.message || 'Failed to remove admin user')
    } finally {
      setIsProcessing(false)
    }
  }

  const openRemoveDialog = (admin: AdminUser) => {
    setSelectedAdmin(admin)
    setIsRemoveDialogOpen(true)
  }

  return (
    <>
      <Card className="border-2 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Admin User Management
              </CardTitle>
              <CardDescription>Manage who has access to the admin dashboard</CardDescription>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="hover-lift"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <div className="py-12 text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No admin users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold">Role</TableHead>
                  <TableHead className="font-bold">Added</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => {
                  const isCurrentUser = admin.user_id === currentUserId
                  return (
                    <TableRow key={admin.id} className="hover:bg-primary/5">
                      <TableCell className="font-medium">
                        {admin.email}
                        {isCurrentUser && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            You
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(admin.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openRemoveDialog(admin)}
                          disabled={isCurrentUser}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          {admins.length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Important Security Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Only grant admin access to trusted users</li>
                  <li>Admins can approve/reject submissions and manage data</li>
                  <li>You cannot remove yourself or the last admin</li>
                  <li>Users must sign up before being granted admin access</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Admin Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin User</DialogTitle>
            <DialogDescription>
              Enter the email address of the user you want to grant admin access to.
              The user must have already signed up for an account.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isProcessing) {
                    handleAddAdmin()
                  }
                }}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The user will immediately gain access to the admin dashboard
                and all administrative functions.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false)
                setNewAdminEmail('')
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddAdmin}
              disabled={isProcessing || !newAdminEmail}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Admin
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Admin Confirmation Dialog */}
      <AlertDialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Admin Access?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove admin access for{' '}
              <strong>{selectedAdmin?.email}</strong>?
              <br />
              <br />
              This user will no longer be able to access the admin dashboard or perform
              administrative actions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAdmin}
              disabled={isProcessing}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                'Remove Admin'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
