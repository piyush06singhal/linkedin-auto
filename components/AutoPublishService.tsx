'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'

// This component runs in the background and automatically publishes scheduled posts
// It checks every 2 minutes for posts that should be published

export default function AutoPublishService() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isCheckingRef = useRef(false)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false
      return true
    }

    const autoPublish = async () => {
      // Prevent multiple simultaneous checks
      if (isCheckingRef.current) return
      
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) return

      isCheckingRef.current = true

      try {
        console.log('🔄 Auto-publish: Checking for scheduled posts...')
        
        const response = await fetch('/api/auto-publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })

        const data = await response.json()

        if (data.published > 0) {
          console.log(`✅ Auto-published ${data.published} post(s)`)
          
          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Posts Published!', {
              body: `${data.published} scheduled post(s) have been published to LinkedIn`,
              icon: '/favicon.ico'
            })
          }
        }

        if (data.failed > 0) {
          console.warn(`⚠️ Failed to publish ${data.failed} post(s)`)
        }

      } catch (error) {
        console.error('Auto-publish error:', error)
      } finally {
        isCheckingRef.current = false
      }
    }

    // Run immediately on mount
    autoPublish()

    // Then run every 2 minutes
    intervalRef.current = setInterval(autoPublish, 2 * 60 * 1000) // 2 minutes

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // This component doesn't render anything
  return null
}
