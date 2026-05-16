import { useState } from 'react'
import './Login.css'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const expectedUsername = import.meta.env.VITE_AUTH_USERNAME
    const expectedPassword = import.meta.env.VITE_AUTH_PASSWORD

    if (username === expectedUsername && password === expectedPassword) {
      const token = btoa(`${username}:${password}`)
      onLogin(token)
    } else {
      setError('Invalid credentials. Please try again.')
      setPassword('')
    }

    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Quantum Founder Roadmap</h1>
        <p className="subtitle">Secure Access Required</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
