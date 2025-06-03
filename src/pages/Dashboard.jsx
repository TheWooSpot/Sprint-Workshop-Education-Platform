import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaTrophy, FaUsers, FaChartLine } from 'react-icons/fa'
import ProgressBar from '../components/ProgressBar'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

function Dashboard() {
  const { userProfile } = useAuth()
  const [topUsers, setTopUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          orderBy('points', 'desc'),
          limit(5)
        )
        
        const querySnapshot = await getDocs(q)
        const users = []
        querySnapshot.forEach((doc) => {
          users.push(doc.data())
        })
        
        setTopUsers(users)
      } catch (error) {
        console.error("Error fetching top users:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTopUsers()
  }, [])
  
  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!userProfile) return { completed: 0, total: 15 }
    
    const day1 = userProfile.progress.day1 || { completed: 0, total: 5 }
    const day2 = userProfile.progress.day2 || { completed: 0, total: 5 }
    const day3 = userProfile.progress.day3 || { completed: 0, total: 5 }
    
    return {
      completed: day1.completed + day2.completed + day3.completed,
      total: day1.total + day2.total + day3.total
    }
  }
  
  const progress = calculateOverallProgress()

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Welcome to the Sprint Workshop</h1>
        <p className="text-text-secondary text-xl">
          Track your progress, complete tasks, and earn points
        </p>
      </motion.div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card bg-gradient-to-br from-primary to-primary-hover"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20">
              <FaTrophy className="text-white text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-white text-lg font-medium">Your Points</h3>
              <p className="text-white text-3xl font-bold">{userProfile?.points || 0}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-blue bg-opacity-20">
              <FaCalendarAlt className="text-accent-blue text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-text-secondary text-lg font-medium">Tasks Completed</h3>
              <p className="text-text-primary text-3xl font-bold">{userProfile?.tasksCompleted || 0}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-green bg-opacity-20">
              <FaChartLine className="text-accent-green text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-text-secondary text-lg font-medium">Overall Progress</h3>
              <p className="text-text-primary text-3xl font-bold">{Math.round((progress.completed / progress.total) * 100)}%</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent-yellow bg-opacity-20">
              <FaUsers className="text-accent-yellow text-2xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-text-secondary text-lg font-medium">Participants</h3>
              <p className="text-text-primary text-3xl font-bold">24</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Workshop Days */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">Workshop Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card card-hover">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Day 1</h3>
                <p className="text-text-secondary">Discover & Align</p>
              </div>
              <span className="badge badge-primary">3 Hours</span>
            </div>
            <p className="text-text-secondary mb-4">
              Understand current processes and align on long-term tech and business goals.
            </p>
            <div className="mb-4">
              <ProgressBar 
                completed={userProfile?.progress?.day1?.completed || 0} 
                total={userProfile?.progress?.day1?.total || 5} 
              />
            </div>
            <Link 
              to="/day/1" 
              className="btn btn-primary w-full flex justify-center items-center"
            >
              View Tasks
            </Link>
          </div>
          
          <div className="card card-hover">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Day 2</h3>
                <p className="text-text-secondary">Frame & Structure</p>
              </div>
              <span className="badge badge-primary">3 Hours</span>
            </div>
            <p className="text-text-secondary mb-4">
              Prioritize objectives, define scope, and structure the development process.
            </p>
            <div className="mb-4">
              <ProgressBar 
                completed={userProfile?.progress?.day2?.completed || 0} 
                total={userProfile?.progress?.day2?.total || 5} 
              />
            </div>
            <Link 
              to="/day/2" 
              className="btn btn-primary w-full flex justify-center items-center"
            >
              View Tasks
            </Link>
          </div>
          
          <div className="card card-hover">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Day 3</h3>
                <p className="text-text-secondary">Plan & Activate</p>
              </div>
              <span className="badge badge-primary">3 Hours</span>
            </div>
            <p className="text-text-secondary mb-4">
              Define action items and next steps for team roles, risk mitigation, and early planning.
            </p>
            <div className="mb-4">
              <ProgressBar 
                completed={userProfile?.progress?.day3?.completed || 0} 
                total={userProfile?.progress?.day3?.total || 5} 
              />
            </div>
            <Link 
              to="/day/3" 
              className="btn btn-primary w-full flex justify-center items-center"
            >
              View Tasks
            </Link>
          </div>
        </div>
      </motion.div>
      
      {/* Leaderboard Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Top Performers</h2>
          <Link 
            to="/leaderboard" 
            className="text-primary hover:text-primary-hover font-semibold"
          >
            View Full Leaderboard
          </Link>
        </div>
        
        <div className="card">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div 
                  key={user.uid} 
                  className="flex items-center justify-between p-3 rounded-lg bg-background-light"
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background-card mr-3">
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                        {user.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold">{user.displayName}</h3>
                        <p className="text-text-secondary text-sm">{user.tasksCompleted} tasks</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center bg-background-card rounded-lg px-3 py-1">
                    <FaTrophy className="text-accent-yellow mr-2" />
                    <span className="font-bold">{user.points}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
