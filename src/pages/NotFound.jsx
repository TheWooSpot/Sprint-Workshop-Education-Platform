import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function NotFound() {
  return (
    <div className="min-h-screen bg-background-dark flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-4xl font-bold mt-4 mb-6">Page Not Found</h2>
        <p className="text-text-secondary text-xl max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link to="/" className="btn btn-primary inline-block">
          Return to Dashboard
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound
