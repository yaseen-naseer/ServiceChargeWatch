'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <Card className="max-w-md border-2 shadow-2xl">
        <CardHeader>
          <div className="text-6xl mb-4 text-center">⚠️</div>
          <CardTitle className="text-2xl text-center">Something went wrong!</CardTitle>
          <CardDescription className="text-center">
            We encountered an unexpected error. This has been logged and we'll look into it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error.message && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-mono">
                {error.message}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button
            onClick={reset}
            className="gradient-primary text-white shadow-lg hover-lift border-0 flex-1"
          >
            Try again
          </Button>
          <Button variant="outline" asChild className="hover-lift flex-1">
            <Link href="/">Go home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
