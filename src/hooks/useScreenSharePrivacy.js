import { useEffect, useState } from 'react'

export function useScreenSharePrivacy() {
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  useEffect(() => {
    let mediaStream = null

    const detectScreenShare = async () => {
      try {
        // Check if getDisplayMedia is available (screen sharing capability)
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
          return
        }

        // Listen for screen capture events
        const checkScreenShare = () => {
          if (navigator.mediaSession) {
            // Some browsers expose screen capture status
            const isSharing = document.hidden === false &&
                            document.visibilityState === 'visible'
            setIsScreenSharing(isSharing)
          }
        }

        // Monitor for visibility changes (screen share often changes visibility state)
        document.addEventListener('visibilitychange', checkScreenShare)

        // Check if screen sharing is active by monitoring for capture-handle (if available)
        if (navigator.mediaDevices.getDisplayMedia) {
          const captureHandle = navigator.mediaDevices.getDisplayMedia
          // If user has initiated screen sharing, apply blur
        }

        return () => {
          document.removeEventListener('visibilitychange', checkScreenShare)
        }
      } catch (err) {
        console.debug('Screen share detection unavailable')
      }
    }

    detectScreenShare()

    // Also detect screen sharing attempts
    const originalGetDisplayMedia = navigator.mediaDevices?.getDisplayMedia
    if (originalGetDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia = async function(...args) {
        setIsScreenSharing(true)
        const stream = await originalGetDisplayMedia.apply(this, args)

        // When screen share stops, remove blur
        stream.getTracks().forEach(track => {
          track.addEventListener('ended', () => {
            setIsScreenSharing(false)
          })
        })

        return stream
      }
    }

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return isScreenSharing
}
