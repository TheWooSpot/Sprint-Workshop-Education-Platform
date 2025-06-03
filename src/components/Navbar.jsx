import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaBars, FaBell, FaUser } from 'react-icons/fa'
import { useState } from 'react'
import { motion } from 'framer-motion'

function Navbar({ toggleSidebar }) {
  const { currentUser, userProfile, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  return (
    <nav className="bg-background-card border-b border-background-light px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="mr-4 text-text-secondary hover:text-primary p-2 rounded-lg md:hidden"
        >
          <FaBars size={24} />
        </button>
        
        <Link to="/" className="flex items-center">
          <img src="/favicon.svg" alt="Logo" className="h-8 w-8 mr-2" />
          <span className="text-xl font-bold font-heading hidden sm:block">Sprint Workshop</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        {userProfile && (
          <div className="hidden md:flex items-center bg-background-light rounded-full px-3 py-1">
            <div className="mr-2 text-accent-yellow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-semibold">{userProfile.points} Points</span>
          </div>
        )}
        
        <button className="relative p-2 text-text-secondary hover:text-primary rounded-full">
          <FaBell size={20} />
          <span className="absolute top-0 right-0 h-4 w-4 bg-accent-red rounded-full text-xs flex items-center justify-center">
            2
          </span>
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <FaUser />}
            </div>
            <span className="hidden md:block font-medium truncate max-w-[120px]">
              {currentUser?.displayName || 'User'}
            </span>
          </button>
          
          {profileOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-48 bg-background-card rounded-xl shadow-lg py-2 z-10"
            >
              <Link 
                to="/profile" 
                className="block px-4 py-2 text-text-primary hover:bg-background-light"
                onClick={() => setProfileOpen(false)}
              >
                Profile
              </Link>
              <Link 
                to="/leaderboard" 
                className="block px-4 py-2 text-text-primary hover:bg-background-light"
                onClick={() => setProfileOpen(false)}
              >
                Leaderboard
              </Link>
              <div className="border-t border-background-light my-1"></div>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-accent-red hover:bg-background-light"
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
