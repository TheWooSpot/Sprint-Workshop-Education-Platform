import { motion } from 'framer-motion'
import { FaTrophy, FaMedal } from 'react-icons/fa'

function LeaderboardCard({ user, rank }) {
  // Determine trophy color based on rank
  const getTrophyColor = () => {
    switch (rank) {
      case 1: return 'text-yellow-400' // Gold
      case 2: return 'text-gray-400' // Silver
      case 3: return 'text-amber-600' // Bronze
      default: return 'text-text-muted'
    }
  }
  
  // Determine if this is a podium position
  const isPodium = rank <= 3
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.05 }}
      className={`card flex items-center p-4 ${isPodium ? 'border-2 border-accent-yellow' : ''}`}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background-light mr-4">
        {isPodium ? (
          <FaTrophy className={getTrophyColor()} size={18} />
        ) : (
          <span className="font-bold">{rank}</span>
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mr-3">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{user.displayName}</h3>
            <p className="text-text-secondary text-sm">{user.tasksCompleted} tasks completed</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center bg-background-light rounded-lg px-3 py-2">
        <FaMedal className="text-accent-yellow mr-2" />
        <span className="font-bold text-lg">{user.points}</span>
      </div>
    </motion.div>
  )
}

export default LeaderboardCard
