import { useEffect, useState } from 'react'

export function useScreenSharePrivacy() {
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  useEffect(() => {
    let checkInterval = null
    let lastDetectionState = false
    let isGetDisplayMediaActive = false

    const detectScreenShare = async () => {
      try {
        let isCurrentlySharing = false

        // Check 1: Direct flag from getDisplayMedia interception
        if (isGetDisplayMediaActive) {
          isCurrentlySharing = true
        }

        // Check 2: Monitor for system-level screen capture via enumerateDevices
        try {
          if (navigator.mediaDevices?.enumerateDevices) {
            const devices = await navigator.mediaDevices.enumerateDevices()
            const videoDevices = devices.filter(d => d.kind === 'videoinput')
            const audioDevices = devices.filter(d => d.kind === 'audioinput')

            // Check if any device has a label (indicates permissions granted/in use)
            if (videoDevices.some(d => d.label) || audioDevices.some(d => d.label)) {
              isCurrentlySharing = true
            }
          }
        } catch (e) {
          // Ignore enumeration errors
        }

        // Check 3: Picture-in-picture detection
        if (document.pictureInPictureElement) {
          isCurrentlySharing = true
        }

        // Check 4: Monitor window property changes
        if (window.name && (window.name.includes('discord') || window.name.includes('share') || window.name.includes('capture'))) {
          isCurrentlySharing = true
        }

        // Update state only if it changed
        if (isCurrentlySharing !== lastDetectionState) {
          setIsScreenSharing(isCurrentlySharing)
          lastDetectionState = isCurrentlySharing
        }
      } catch (err) {
        // Silent error handling
      }
    }

    // Immediate initial checks
    detectScreenShare()

    // Aggressive periodic checking every 300ms for responsive detection
    checkInterval = setInterval(detectScreenShare, 300)

    // Hook into getDisplayMedia for browser-based screen share
    const originalGetDisplayMedia = navigator.mediaDevices?.getDisplayMedia
    if (originalGetDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia = async function(...args) {
        isGetDisplayMediaActive = true
        setIsScreenSharing(true)
        lastDetectionState = true

        try {
          const stream = await originalGetDisplayMedia.apply(this, args)

          // Monitor all tracks for when they end
          const trackEndHandler = () => {
            isGetDisplayMediaActive = false
            setIsScreenSharing(false)
            lastDetectionState = false
          }

          stream.getTracks().forEach(track => {
            track.addEventListener('ended', trackEndHandler)
            track.addEventListener('stop', trackEndHandler)
          })

          // Also monitor stream active state
          stream.addEventListener('inactive', trackEndHandler)

          return stream
        } catch (err) {
          isGetDisplayMediaActive = false
          setIsScreenSharing(false)
          lastDetectionState = false
          throw err
        }
      }
    }

    // Listen for multiple events that indicate screen share state changes
    const handleScreenShareChange = () => {
      detectScreenShare()
    }

    document.addEventListener('visibilitychange', handleScreenShareChange)
    window.addEventListener('focus', handleScreenShareChange)
    window.addEventListener('blur', handleScreenShareChange)
    window.addEventListener('resize', handleScreenShareChange)

    // Listen for permission prompt (indicates screen share attempt)
    const handlePermissionChange = (permissionStatus) => {
      if (permissionStatus.name === 'display-capture') {
        if (permissionStatus.state === 'granted') {
          detectScreenShare()
        }
      }
    }

    try {
      navigator.permissions?.query({ name: 'display-capture' }).then(handlePermissionChange)
    } catch (e) {
      // Some browsers don't support display-capture permission query
    }

    // Listen for Discord-specific events
    document.addEventListener('discord-screen-share-start', () => {
      isGetDisplayMediaActive = true
      setIsScreenSharing(true)
      lastDetectionState = true
    })

    document.addEventListener('discord-screen-share-stop', () => {
      isGetDisplayMediaActive = false
      setIsScreenSharing(false)
      lastDetectionState = false
    })

    return () => {
      if (checkInterval) clearInterval(checkInterval)
      document.removeEventListener('visibilitychange', handleScreenShareChange)
      window.removeEventListener('focus', handleScreenShareChange)
      window.removeEventListener('blur', handleScreenShareChange)
      window.removeEventListener('resize', handleScreenShareChange)
      document.removeEventListener('discord-screen-share-start', handleScreenShareChange)
      document.removeEventListener('discord-screen-share-stop', handleScreenShareChange)

      // Restore original getDisplayMedia if it was patched
      if (originalGetDisplayMedia && navigator.mediaDevices) {
        navigator.mediaDevices.getDisplayMedia = originalGetDisplayMedia
      }
    }
  }, [])

  return isScreenSharing
}
