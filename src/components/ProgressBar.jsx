import React from 'react'
import { motion } from 'framer-motion'

function ProgressBar({ completed, total }) {
  const percentage = Math.round((completed / total) * 100)
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold">{percentage}% Complete</span>
        <span className="text-text-secondary">
          {completed}/{total} tasks
        </span>
      </div>
      
      <div className="h-4 bg-background-light rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-primary rounded-full"
        />
      </div>
    </div>
  )
}

export default ProgressBar
