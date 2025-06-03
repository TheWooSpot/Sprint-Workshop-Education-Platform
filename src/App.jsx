import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import WorkshopDay from './pages/WorkshopDay'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

function App() {
  const { currentUser, bypassMode, loading } = useAuth()
  
  // Log authentication state for debugging
  useEffect(() => {
    console.log("Auth state:", { currentUser: !!currentUser, bypassMode, loading })
  }, [currentUser, bypassMode, loading])

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!currentUser && !bypassMode) {
      console.log("Access denied, redirecting to login")
      return <Navigate to="/login" replace />
    }
    console.log("Access granted to protected route")
    return children
  }

  // Redirect from login if already authenticated
  const PublicRoute = ({ children }) => {
    if (currentUser || bypassMode) {
      console.log("Already authenticated, redirecting to dashboard")
      return <Navigate to="/" replace />
    }
    return children
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="day/:dayId" element={<WorkshopDay />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
