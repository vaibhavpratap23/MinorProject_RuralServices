import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ThemeProvider } from './lib/theme'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import WorkerVerification from './pages/WorkerVerification'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    setIsAuthenticated(!!token)
  }, [])

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <Login onLogin={() => setIsAuthenticated(true)} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <nav className="glass backdrop-blur-xl border-b border-white/10 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <h1 className="text-xl font-semibold gradient-text">Admin Panel</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    localStorage.removeItem('adminToken')
                    setIsAuthenticated(false)
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workers" element={<WorkerVerification />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
