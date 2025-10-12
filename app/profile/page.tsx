import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { User, Mail, Calendar, FileText, CheckCircle, XCircle, Clock, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default async function ProfilePage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirectTo=/profile')
  }

  // Check if user is admin
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('role, created_at')
    .eq('user_id', user.id)
    .maybeSingle()

  // Fetch user's submission statistics
  const { data: submissions } = await supabase
    .from('submissions')
    .select(`
      id,
      status,
      created_at,
      hotels (name)
    `)
    .eq('submitter_user_id', user.id)
    .order('created_at', { ascending: false })

  const totalSubmissions = submissions?.length || 0
  const approvedSubmissions = submissions?.filter(s => s.status === 'approved').length || 0
  const pendingSubmissions = submissions?.filter(s => s.status === 'pending').length || 0
  const rejectedSubmissions = submissions?.filter(s => s.status === 'rejected').length || 0

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
              SC
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-xs text-muted-foreground">Service Charge Watch</p>
            </div>
          </div>
          <nav className="flex gap-3">
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/submissions">My Submissions</Link>
            </Button>
            {adminUser && (
              <Button variant="ghost" asChild className="hover-lift">
                <Link href="/admin/dashboard">Admin</Link>
              </Button>
            )}
            <Button variant="ghost" asChild className="hover-lift">
              <Link href="/auth/logout">Logout</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            👤 Account Information
          </div>
          <h2 className="text-5xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Profile & Statistics
          </h2>
          <p className="text-muted-foreground text-lg">
            View your account information and submission history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Information */}
          <div className="lg:col-span-2 space-y-6 animate-slide-up">
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>Your account details and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </div>
                    <p className="font-medium">{user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Member Since
                    </div>
                    <p className="font-medium">
                      {format(new Date(user.created_at), 'MMMM d, yyyy')}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      Account Status
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Active</Badge>
                      {adminUser && (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          {adminUser.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Total Submissions
                    </div>
                    <p className="font-medium text-2xl">{totalSubmissions}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">Quick Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild>
                      <Link href="/submit">Submit New Data</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/submissions">View My Submissions</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Submissions
                </CardTitle>
                <CardDescription>Your latest service charge submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {submissions && submissions.length > 0 ? (
                  <div className="space-y-3">
                    {submissions.slice(0, 5).map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{(submission.hotels as any)?.name || 'Unknown Hotel'}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(submission.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div>
                          {submission.status === 'approved' && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          )}
                          {submission.status === 'pending' && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {submission.status === 'rejected' && (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Rejected
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {submissions.length > 5 && (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/submissions">View All Submissions</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-muted-foreground mb-4">No submissions yet</p>
                    <Button asChild>
                      <Link href="/submit">Submit Your First Entry</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Card className="border-2 shadow-xl bg-gradient-to-br from-green-50/50 to-transparent">
              <CardHeader className="pb-3">
                <CardDescription className="text-sm font-medium text-green-800">
                  <CheckCircle className="h-4 w-4 inline mr-1" />
                  Approved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-green-700">{approvedSubmissions}</p>
                <p className="text-sm text-muted-foreground mt-1">Verified records</p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-xl bg-gradient-to-br from-yellow-50/50 to-transparent">
              <CardHeader className="pb-3">
                <CardDescription className="text-sm font-medium text-yellow-800">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Pending Review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-yellow-700">{pendingSubmissions}</p>
                <p className="text-sm text-muted-foreground mt-1">Awaiting review</p>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-xl bg-gradient-to-br from-red-50/50 to-transparent">
              <CardHeader className="pb-3">
                <CardDescription className="text-sm font-medium text-red-800">
                  <XCircle className="h-4 w-4 inline mr-1" />
                  Rejected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-red-700">{rejectedSubmissions}</p>
                <p className="text-sm text-muted-foreground mt-1">Not approved</p>
              </CardContent>
            </Card>

            {adminUser && (
              <Card className="border-2 shadow-xl bg-gradient-to-br from-purple-50/50 to-transparent">
                <CardHeader className="pb-3">
                  <CardDescription className="text-sm font-medium text-purple-800">
                    <Shield className="h-4 w-4 inline mr-1" />
                    Admin Access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">
                    You have {adminUser.role === 'super_admin' ? 'super admin' : 'admin'} privileges
                  </p>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/admin/dashboard">Go to Dashboard</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
