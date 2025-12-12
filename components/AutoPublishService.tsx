'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function AutoPublishService() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isCheckingRef = useRef(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return !!user
    }

    const showNotification = (title: string, body: string) => {
      // Try browser notification first
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'linkedin-auto-publish',
          requireInteraction: true
        })
        
        notification.onclick = () => {
          window.focus()
          notification.close()
        }
      }
      
      // Also show alert as fallback
      alert(`${title}\n\n${body}`)
    }

    const autoPublish = async () => {
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
          showNotification(
            '🎉 Posts Published!',
            `${data.published} scheduled post(s) have been published to LinkedIn`
          )
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

    // Request notification permission immediately
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          console.log('Notification permission:', permission)
        })
      }
    }

    autoPublish()
    intervalRef.current = setInterval(autoPublish, 2 * 60 * 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return null
}
