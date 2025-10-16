'use client'

import { useEffect, useState } from 'react'
import { WifiOff, Wifi } from 'lucide-react'

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine)

    // Handle online status changes
    const handleOnline = () => {
      console.log('📡 Connection restored')
      setIsOnline(true)
      setShowReconnected(true)

      // Hide the "reconnected" message after 3 seconds
      setTimeout(() => {
        setShowReconnected(false)
      }, 3000)
    }

    const handleOffline = () => {
      console.log('📡 Connection lost')
      setIsOnline(false)
      setShowReconnected(false)
    }

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Don't show anything if online (and not recently reconnected)
  if (isOnline && !showReconnected) {
    return null
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      {!isOnline ? (
        <div className="glass-card px-4 py-2 rounded-full border-2 border-red-500/50 bg-red-50/90 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2 text-sm font-medium text-red-700">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span>You're offline</span>
          </div>
        </div>
      ) : (
        <div className="glass-card px-4 py-2 rounded-full border-2 border-green-500/50 bg-green-50/90 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2 text-sm font-medium text-green-700">
            <Wifi className="w-4 h-4" />
            <span>Back online</span>
          </div>
        </div>
      )}
    </div>
  )
}
