import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaEnvelope, FaLock, FaSpinner, FaUserAlt, FaExternalLinkAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [bypassLoading, setBypassLoading] = useState(false)
  const { login, loginWithDemo, enableBypassMode, bypassMode, currentUser } = useAuth()
  const navigate = useNavigate()
  
  // Redirect if already authenticated
  useEffect(() => {
    if (bypassMode || currentUser) {
      navigate('/')
    }
  }, [bypassMode, currentUser, navigate])
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }
    
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Login successful!')
      navigate('/')
    } catch (error) {
      console.error(error)
      let errorMessage = 'Failed to log in'
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password'
      }
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setDemoLoading(true)
    try {
      console.log("Attempting demo login");
      await loginWithDemo()
      toast.success('Demo login successful!')
      navigate('/')
    } catch (error) {
      console.error("Demo login error:", error)
      let errorMessage = 'Failed to log in with demo account'
      
      // More specific error messages
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Demo account exists but cannot be accessed. Please try again.'
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.'
      }
      
      toast.error(errorMessage)
    } finally {
      setDemoLoading(false)
    }
  }

  const handleBypassLogin = async () => {
    setBypassLoading(true)
    try {
      await enableBypassMode()
      toast.success('Workshop access granted!')
      // Force navigation after state update
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 100)
    } catch (error) {
      console.error("Bypass login error:", error)
      toast.error('Failed to access workshop. Please try again.')
    } finally {
      setBypassLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <img 
          src="/favicon.svg" 
          alt="Logo" 
          className="mx-auto h-16 w-16"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-text-secondary">
          Access the Foundational Sprint Workshop
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="card py-8 px-4 sm:px-10">
          {/* Bypass Login Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleBypassLogin}
              disabled={bypassLoading}
              className="btn bg-accent-green text-white hover:bg-accent-green/90 w-full flex justify-center items-center"
            >
              {bypassLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Accessing workshop...
                </>
              ) : (
                <>
                  <FaExternalLinkAlt className="mr-2" />
                  Quick Access (No Login Required)
                </>
              )}
            </button>
            <p className="mt-2 text-xs text-center text-text-secondary">
              Bypass authentication and access the workshop directly
            </p>
          </div>

          {/* Demo Account Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="btn bg-primary-light text-primary-dark hover:bg-primary-light/90 w-full flex justify-center items-center"
            >
              {demoLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Loading demo...
                </>
              ) : (
                <>
                  <FaUserAlt className="mr-2" />
                  Try Demo Account
                </>
              )}
            </button>
            <p className="mt-2 text-xs text-center text-text-secondary">
              No sign up required. Explore the platform with sample data.
            </p>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-background-light"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-card text-text-secondary">
                Or sign in with email
              </span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-text-muted" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-text-muted" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-background-light rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-hover">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-background-light"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background-card text-text-secondary">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="btn bg-background-light text-text-primary hover:bg-background-light/80 flex justify-center items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="btn bg-background-light text-text-primary hover:bg-background-light/80 flex justify-center items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 2.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
                GitHub
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
