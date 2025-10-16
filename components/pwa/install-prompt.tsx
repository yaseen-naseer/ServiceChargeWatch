'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, X, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isInStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://')

    setIsStandalone(isInStandaloneMode)

    // Check if user has already dismissed the prompt
    const hasUserDismissed = localStorage.getItem('pwa-install-dismissed')
    if (hasUserDismissed === 'true') {
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()

      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show the install prompt after a delay (better UX)
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if the app was successfully installed
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA was installed')
      setShowPrompt(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('✅ User accepted the install prompt')
    } else {
      console.log('❌ User dismissed the install prompt')
    }

    // Clear the deferred prompt
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Remember user dismissed (for 30 days)
    localStorage.setItem('pwa-install-dismissed', 'true')
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed')
    }, 30 * 24 * 60 * 60 * 1000) // 30 days
  }

  // Don't show if already installed or if prompt not available
  if (isStandalone || !showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <Card className="glass-card border-2 shadow-2xl border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Install App</CardTitle>
                <CardDescription className="text-xs">
                  Add to your home screen
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 -mt-1"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Install Service Charge Watch for quick access and offline support. No app store needed!
          </p>

          <div className="flex gap-2">
            <Button
              onClick={handleInstallClick}
              className="flex-1 gap-2"
            >
              <Download className="h-4 w-4" />
              Install
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1"
            >
              Not Now
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            ✓ Works offline • ✓ Fast loading • ✓ Home screen icon
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
