import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaTrophy, FaCalendarAlt, FaEdit, FaSpinner } from 'react-icons/fa'
import ProgressBar from '../components/ProgressBar'
import { updateProfile } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { toast } from 'react-toastify'

function Profile() {
  const { currentUser, userProfile, fetchUserProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '')
  const [loading, setLoading] = useState(false)
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    
    if (!displayName.trim()) {
      toast.error('Name cannot be empty')
      return
    }
    
    setLoading(true)
    try {
      // Update Firebase Auth profile
      await updateProfile(currentUser, { displayName })
      
      // Update Firestore document
      const userRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userRef, { displayName })
      
      // Refresh user profile
      await fetchUserProfile(currentUser.uid)
      
      setEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }
  
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
        <h1 className="text-4xl font-bold mb-2">Your Profile</h1>
        <p className="text-text-secondary text-xl">
          Manage your account and view your progress
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="card">
            <div className="flex flex-col items-center pb-6">
              <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-5xl font-bold mb-4">
                {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <FaUser size={48} />}
              </div>
              
              {editing ? (
                <form onSubmit={handleUpdateProfile} className="w-full">
                  <div className="mb-4">
                    <label htmlFor="displayName" className="block text-sm font-medium text-text-secondary mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="input"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary flex-1 flex justify-center items-center"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false)
                        setDisplayName(currentUser?.displayName || '')
                      }}
                      className="btn btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{currentUser?.displayName}</h2>
                  <p className="text-text-secondary">{currentUser?.email}</p>
                  
                  <button
                    onClick={() => setEditing(true)}
                    className="mt-4 btn btn-outline flex items-center"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </button>
                </>
              )}
            </div>
            
            <div className="border-t border-background-light pt-6">
              <h3 className="text-xl font-bold mb-4">Account Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-background-light mr-3">
                    <FaUser className="text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">Full Name</p>
                    <p className="font-medium">{currentUser?.displayName}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-background-light mr-3">
                    <FaEnvelope className="text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">Email Address</p>
                    <p className="font-medium">{currentUser?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-background-light mr-3">
                    <FaTrophy className="text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">Total Points</p>
                    <p className="font-medium">{userProfile?.points || 0} points</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-background-light mr-3">
                    <FaCalendarAlt className="text-text-secondary" />
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">Joined On</p>
                    <p className="font-medium">
                      {userProfile?.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Progress and Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="card mb-6">
            <h3 className="text-xl font-bold mb-4">Workshop Progress</h3>
            
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">Overall Progress</h4>
              <ProgressBar completed={progress.completed} total={progress.total} />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Day 1: Discover & Align</h4>
                  <span className="text-text-secondary">
                    {userProfile?.progress?.day1?.completed || 0}/{userProfile?.progress?.day1?.total || 5} tasks
                  </span>
                </div>
                <div className="h-3 bg-background-light rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ 
                      width: `${((userProfile?.progress?.day1?.completed || 0) / (userProfile?.progress?.day1?.total || 5)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Day 2: Frame & Structure</h4>
                  <span className="text-text-secondary">
                    {userProfile?.progress?.day2?.completed || 0}/{userProfile?.progress?.day2?.total || 5} tasks
                  </span>
                </div>
                <div className="h-3 bg-background-light rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ 
                      width: `${((userProfile?.progress?.day2?.completed || 0) / (userProfile?.progress?.day2?.total || 5)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">Day 3: Plan & Activate</h4>
                  <span className="text-text-secondary">
                    {userProfile?.progress?.day3?.completed || 0}/{userProfile?.progress?.day3?.total || 5} tasks
                  </span>
                </div>
                <div className="h-3 bg-background-light rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ 
                      width: `${((userProfile?.progress?.day3?.completed || 0) / (userProfile?.progress?.day3?.total || 5)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Achievements</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border-2 ${userProfile?.tasksCompleted >= 1 ? 'border-accent-green bg-accent-green bg-opacity-10' : 'border-background-light bg-background-light'}`}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${userProfile?.tasksCompleted >= 1 ? 'bg-accent-green text-white' : 'bg-background-card text-text-muted'}`}>
                    <FaTrophy />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">First Steps</h4>
                    <p className="text-sm text-text-secondary">Complete your first task</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl border-2 ${userProfile?.tasksCompleted >= 5 ? 'border-accent-green bg-accent-green bg-opacity-10' : 'border-background-light bg-background-light'}`}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${userProfile?.tasksCompleted >= 5 ? 'bg-accent-green text-white' : 'bg-background-card text-text-muted'}`}>
                    <FaTrophy />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Getting Started</h4>
                    <p className="text-sm text-text-secondary">Complete 5 tasks</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl border-2 ${userProfile?.tasksCompleted >= 10 ? 'border-accent-green bg-accent-green bg-opacity-10' : 'border-background-light bg-background-light'}`}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${userProfile?.tasksCompleted >= 10 ? 'bg-accent-green text-white' : 'bg-background-card text-text-muted'}`}>
                    <FaTrophy />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Halfway There</h4>
                    <p className="text-sm text-text-secondary">Complete 10 tasks</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl border-2 ${userProfile?.tasksCompleted >= 15 ? 'border-accent-green bg-accent-green bg-opacity-10' : 'border-background-light bg-background-light'}`}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${userProfile?.tasksCompleted >= 15 ? 'bg-accent-green text-white' : 'bg-background-card text-text-muted'}`}>
                    <FaTrophy />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Workshop Master</h4>
                    <p className="text-sm text-text-secondary">Complete all tasks</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl border-2 ${userProfile?.points >= 100 ? 'border-accent-green bg-accent-green bg-opacity-10' : 'border-background-light bg-background-light'}`}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${userProfile?.points >= 100 ? 'bg-accent-green text-white' : 'bg-background-card text-text-muted'}`}>
                    <FaTrophy />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Point Collector</h4>
                    <p className="text-sm text-text-secondary">Earn 100 points</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl border-2 ${userProfile?.points >= 200 ? 'border-accent-green bg-accent-green bg-opacity-10' : 'border-background-light bg-background-light'}`}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${userProfile?.points >= 200 ? 'bg-accent-green text-white' : 'bg-background-card text-text-muted'}`}>
                    <FaTrophy />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Sprint Champion</h4>
                    <p className="text-sm text-text-secondary">Earn 200 points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
