import { useEffect, useState } from 'react'

export function useScreenSharePrivacy() {
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  useEffect(() => {
    let checkInterval = null

    const checkCapture = async () => {
      try {
        // Method 1: Check if browser tab is being captured via permissions
        if (navigator.permissions && navigator.permissions.query) {
          try {
            const result = await navigator.permissions.query({ name: 'camera' })
            if (result.state === 'granted') {
              setIsScreenSharing(true)
              return
            }
          } catch (e) {
            // Permission query not supported
          }
        }

        // Method 2: Check for active media streams and capture handles
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices()
          // If there are active capture devices, screen might be shared
          const hasVideoInput = devices.some(d => d.kind === 'videoinput' && d.deviceId !== '')
          const hasAudioInput = devices.some(d => d.kind === 'audioinput' && d.deviceId !== '')

          if (hasVideoInput && hasAudioInput) {
            setIsScreenSharing(true)
            return
          }
        }

        // Method 3: Check if document.documentElement has capture handle
        if (document.documentElement.hasAttribute('data-capture')) {
          setIsScreenSharing(true)
          return
        }

        // Method 4: Monitor for changes in screen properties (Discord detection)
        const checkScreenProperties = () => {
          // If screen dimensions or properties change unexpectedly
          if (window.innerHeight < screen.height * 0.95) {
            setIsScreenSharing(true)
            return true
          }
          return false
        }

        if (!checkScreenProperties()) {
          setIsScreenSharing(false)
        }
      } catch (err) {
        // Silent catch
      }
    }

    // Initial check
    checkCapture()

    // Set up periodic checking (every 500ms for responsive blur)
    checkInterval = setInterval(checkCapture, 500)

    // Detect when getDisplayMedia is called (browser screen share)
    const originalGetDisplayMedia = navigator.mediaDevices?.getDisplayMedia
    if (originalGetDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia = async function(...args) {
        setIsScreenSharing(true)
        const stream = await originalGetDisplayMedia.apply(this, args)

        stream.getTracks().forEach(track => {
          track.addEventListener('ended', () => {
            setIsScreenSharing(false)
          })
        })

        return stream
      }
    }

    // Listen for visibility changes
    const handleVisibilityChange = () => {
      checkCapture()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', checkCapture)
    window.addEventListener('blur', () => {
      // When window loses focus, might be screen sharing
      setTimeout(checkCapture, 100)
    })

    return () => {
      if (checkInterval) clearInterval(checkInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', checkCapture)
      window.removeEventListener('blur', checkCapture)
    }
  }, [])

  return isScreenSharing
}
