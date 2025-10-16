import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { WifiOff, RefreshCcw, Home } from 'lucide-react'

export const metadata = {
  title: 'Offline | Service Charge Watch',
  description: 'You are currently offline',
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <Card className="max-w-md w-full glass-card border-2 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <WifiOff className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold mb-2">You're Offline</CardTitle>
          <CardDescription className="text-base">
            It looks like you've lost your internet connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Some features may not be available while you're offline. Please check your connection and try again.
          </p>

          <div className="space-y-2">
            <Button
              className="w-full gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="w-4 h-4" />
              Retry Connection
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2"
              asChild
            >
              <Link href="/">
                <Home className="w-4 h-4" />
                Go to Home
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold mb-2">While you're offline:</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>✓ You can view previously loaded pages</li>
              <li>✗ You cannot submit new data</li>
              <li>✗ You cannot view updated leaderboards</li>
              <li>✗ Admin features are unavailable</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
