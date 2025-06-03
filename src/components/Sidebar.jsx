import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaTimes, FaHome, FaCalendarAlt, FaTrophy, FaUser } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

function Sidebar({ isOpen, toggleSidebar }) {
  const { userProfile } = useAuth()
  
  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
  }
  
  const navItems = [
    { path: "/", icon: <FaHome size={20} />, label: "Dashboard" },
    { path: "/day/1", icon: <FaCalendarAlt size={20} />, label: "Day 1", badge: userProfile?.progress?.day1 },
    { path: "/day/2", icon: <FaCalendarAlt size={20} />, label: "Day 2", badge: userProfile?.progress?.day2 },
    { path: "/day/3", icon: <FaCalendarAlt size={20} />, label: "Day 3", badge: userProfile?.progress?.day3 },
    { path: "/leaderboard", icon: <FaTrophy size={20} />, label: "Leaderboard" },
    { path: "/profile", icon: <FaUser size={20} />, label: "Profile" }
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <motion.div 
        className="fixed md:static inset-y-0 left-0 w-64 bg-background-card z-30 flex flex-col shadow-lg md:shadow-none"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        style={{ display: isOpen ? "flex" : "none" }}
        className="md:flex"
      >
        <div className="flex items-center justify-between p-4 border-b border-background-light">
          <div className="flex items-center">
            <img src="/favicon.svg" alt="Logo" className="h-8 w-8 mr-2" />
            <h1 className="text-xl font-bold font-heading">Sprint Workshop</h1>
          </div>
          <button 
            onClick={toggleSidebar}
            className="text-text-secondary hover:text-primary p-1 rounded-lg md:hidden"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-text-secondary hover:bg-background-light hover:text-text-primary'
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 768) {
                    toggleSidebar()
                  }
                }}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
                
                {item.badge && (
                  <div className="ml-auto flex items-center">
                    <span className="text-sm font-semibold">
                      {item.badge.completed}/{item.badge.total}
                    </span>
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-background-light">
          <div className="bg-background-light rounded-xl p-4">
            <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
            <p className="text-text-secondary text-sm mb-3">
              Contact our support team for assistance with the workshop.
            </p>
            <button className="btn btn-primary w-full">Contact Support</button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar
