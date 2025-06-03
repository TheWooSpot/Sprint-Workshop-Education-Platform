import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import TaskCard from '../components/TaskCard'
import ProgressBar from '../components/ProgressBar'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { workshopData } from '../data/workshopData'

function WorkshopDay() {
  const { dayId } = useParams()
  const { userProfile, fetchUserProfile, currentUser } = useAuth()
  const [completedTasks, setCompletedTasks] = useState([])
  const [dayData, setDayData] = useState(null)
  
  useEffect(() => {
    // Find the day data
    const day = workshopData.find(day => day.id === parseInt(dayId))
    if (day) {
      setDayData(day)
    }
    
    // Set completed tasks from user profile
    if (userProfile && userProfile.progress) {
      const dayProgress = userProfile.progress[`day${dayId}`]
      if (dayProgress && dayProgress.completedTasks) {
        setCompletedTasks(dayProgress.completedTasks)
      }
    }
  }, [dayId, userProfile])
  
  const handleTaskComplete = async (taskId) => {
    // Update local state
    setCompletedTasks(prev => [...prev, taskId])
    
    // Update Firestore
    try {
      const userRef = doc(db, 'users', currentUser.uid)
      await updateDoc(userRef, {
        [`progress.day${dayId}.completedTasks`]: [...completedTasks, taskId]
      })
      
      // Refresh user profile
      await fetchUserProfile(currentUser.uid)
    } catch (error) {
      console.error("Error updating completed tasks:", error)
    }
  }
  
  if (!dayData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  const progress = {
    completed: userProfile?.progress?.[`day${dayId}`]?.completed || 0,
    total: userProfile?.progress?.[`day${dayId}`]?.total || dayData.tasks.length
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Day {dayData.id}: {dayData.title}</h1>
            <p className="text-text-secondary text-xl">{dayData.description}</p>
          </div>
          <div className="mt-4 md:mt-0 bg-background-card p-3 rounded-xl">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <span className="block text-text-secondary">Duration</span>
                <span className="text-2xl font-bold">3 Hours</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Your Progress</h2>
          <ProgressBar completed={progress.completed} total={progress.total} />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4">Workshop Tasks</h2>
        <div className="space-y-4">
          {dayData.tasks.map((task, index) => {
            // Determine if task is locked (previous task not completed)
            const isLocked = index > 0 && 
              !completedTasks.includes(dayData.tasks[index - 1].id)
            
            // Check if task is completed
            const isCompleted = completedTasks.includes(task.id)
            
            return (
              <TaskCard
                key={task.id}
                task={task}
                dayId={dayId}
                isLocked={isLocked}
                isCompleted={isCompleted}
                onComplete={handleTaskComplete}
              />
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

export default WorkshopDay
