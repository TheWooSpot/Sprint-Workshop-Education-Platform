import React, { useState } from 'react'
import { FaCheckCircle, FaRegCircle, FaLock, FaTrophy } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { doc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import Confetti from 'react-confetti'

function TaskCard({ task, dayId, isLocked = false, isCompleted = false, onComplete }) {
  const { currentUser, fetchUserProfile } = useAuth()
  const [completing, setCompleting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  
  const handleComplete = async () => {
    if (isLocked || isCompleted || completing) return
    
    setCompleting(true)
    try {
      const userRef = doc(db, 'users', currentUser.uid)
      
      // Update user document
      await updateDoc(userRef, {
        [`progress.day${dayId}.completed`]: increment(1),
        points: increment(task.points),
        tasksCompleted: increment(1)
      })
      
      // Show success animation
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
      
      // Refresh user profile
      await fetchUserProfile(currentUser.uid)
      
      // Notify parent component
      if (onComplete) onComplete(task.id)
      
      toast.success(`Task completed! +${task.points} points`)
    } catch (error) {
      console.error("Error completing task:", error)
      toast.error("Failed to complete task. Please try again.")
    } finally {
      setCompleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`card ${!isLocked && !isCompleted ? 'card-hover' : ''} relative overflow-hidden`}
    >
      {showConfetti && (
        <div className="absolute inset-0 z-10">
          <Confetti
            width={400}
            height={300}
            recycle={false}
            numberOfPieces={200}
          />
        </div>
      )}
      
      <div className="flex items-start mb-4">
        <div className="flex-shrink-0">
          <img 
            src={task.image} 
            alt={task.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
        </div>
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold">{task.title}</h3>
            <div className="flex items-center bg-background-light rounded-full px-2 py-1">
              <FaTrophy className="text-accent-yellow mr-1" />
              <span className="font-semibold">{task.points}</span>
            </div>
          </div>
          <p className="text-text-secondary mt-1">{task.description}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {task.tags.map((tag, index) => (
            <span key={index} className="badge badge-secondary">
              {tag}
            </span>
          ))}
        </div>
        
        <button
          onClick={handleComplete}
          disabled={isLocked || isCompleted || completing}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isLocked 
              ? 'bg-background-light text-text-muted cursor-not-allowed'
              : isCompleted
                ? 'bg-accent-green text-white cursor-default'
                : 'bg-primary text-white hover:bg-primary-hover'
          }`}
        >
          {isLocked ? (
            <>
              <FaLock />
              <span>Locked</span>
            </>
          ) : isCompleted ? (
            <>
              <FaCheckCircle />
              <span>Completed</span>
            </>
          ) : (
            <>
              <FaRegCircle />
              <span>Complete</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

export default TaskCard
