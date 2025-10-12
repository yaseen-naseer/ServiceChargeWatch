import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <Card className="max-w-md border-2 shadow-2xl text-center">
        <CardHeader>
          <div className="text-8xl mb-4">404</div>
          <CardTitle className="text-3xl">Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Don't worry, you can find plenty of service charge data on our homepage.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="gradient-primary text-white shadow-lg hover-lift border-0 w-full">
            <Link href="/">Go to Homepage</Link>
          </Button>
          <Button variant="outline" asChild className="hover-lift w-full">
            <Link href="/about">Learn About Us</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
