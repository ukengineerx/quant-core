import { useState } from 'react'
import Login from './components/Login'
import QuantumGuide from './QuantumGuide'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem('auth-token')
    return stored !== null
  })

  const handleLogin = (token) => {
    localStorage.setItem('auth-token', token)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return <QuantumGuide onLogout={handleLogout} />
}

export default App
