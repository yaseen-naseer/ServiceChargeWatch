'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validSession, setValidSession] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if user has valid recovery session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setValidSession(true)
      } else {
        setError('Invalid or expired reset link. Please request a new one.')
      }
    }
    checkSession()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!validSession && error) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg px-4 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary text-white font-bold text-2xl shadow-2xl mb-4">
              SC
            </div>
          </div>

          <Card className="border-2 shadow-2xl hover-lift">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <CardTitle className="text-2xl">Invalid Reset Link</CardTitle>
              <CardDescription>
                This password reset link is invalid or has expired
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                asChild
                className="w-full gradient-primary text-white shadow-lg hover-lift border-0"
              >
                <Link href="/auth/forgot-password">Request New Reset Link</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg px-4 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary text-white font-bold text-2xl shadow-2xl mb-4">
              SC
            </div>
          </div>

          <Card className="border-2 shadow-2xl hover-lift">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
              <CardDescription>
                Your password has been updated successfully
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="bg-primary/5 border-primary/20">
                <AlertDescription>
                  Redirecting you to login page in a few seconds...
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full gradient-primary text-white shadow-lg hover-lift border-0"
              >
                <Link href="/auth/login">Go to Login Now</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary text-white font-bold text-2xl shadow-2xl mb-4">
            SC
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-muted-foreground">
            Create a new secure password
          </p>
        </div>

        <Card className="border-2 shadow-2xl hover-lift">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Password</CardTitle>
              <CardDescription>
                Choose a strong password to protect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="transition-all focus:scale-[1.02]"
                />
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="transition-all focus:scale-[1.02]"
                />
              </div>

              {password && confirmPassword && (
                <Alert className={password === confirmPassword ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                  <AlertDescription className={password === confirmPassword ? 'text-green-800' : 'text-red-800'}>
                    {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                className="w-full gradient-primary text-white shadow-lg hover-lift border-0"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                asChild
                className="w-full"
              >
                <Link href="/auth/login">Cancel</Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
