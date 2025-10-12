import { Loader2 } from 'lucide-react'

export function LoadingSpinner({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
    </div>
  )
}

export function LoadingCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-muted h-32 rounded-lg"></div>
    </div>
  )
}

export function LoadingTable() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-muted rounded"></div>
      ))}
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center text-white font-bold text-2xl shadow-2xl animate-pulse">
          SC
        </div>
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
