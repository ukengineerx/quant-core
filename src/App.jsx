import { useState } from 'react'
import Login from './components/Login'
import QuantumGuide from './QuantumGuide'
import { useScreenSharePrivacy } from './hooks/useScreenSharePrivacy'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem('auth-token')
    return stored !== null
  })
  const isScreenSharing = useScreenSharePrivacy()

  const handleLogin = (token) => {
    localStorage.setItem('auth-token', token)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    setIsAuthenticated(false)
  }

  const appStyle = {
    filter: isScreenSharing ? 'blur(10px)' : 'none',
    transition: 'filter 0.3s ease-in-out',
    position: 'relative'
  }

  if (!isAuthenticated) {
    return <div style={appStyle}><Login onLogin={handleLogin} /></div>
  }

  return <div style={appStyle}><QuantumGuide onLogout={handleLogout} /></div>
}

export default App
