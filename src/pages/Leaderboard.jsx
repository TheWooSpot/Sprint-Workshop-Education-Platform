import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import LeaderboardCard from '../components/LeaderboardCard'
import { FaTrophy, FaMedal, FaSearch } from 'react-icons/fa'

function Leaderboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(
          collection(db, 'users'),
          orderBy('points', 'desc')
        )
        
        const querySnapshot = await getDocs(q)
        const usersData = []
        querySnapshot.forEach((doc) => {
          usersData.push(doc.data())
        })
        
        setUsers(usersData)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [])
  
  // Filter users based on search term and filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'all') return matchesSearch
    if (filter === 'top10') return matchesSearch && users.indexOf(user) < 10
    if (filter === 'top3') return matchesSearch && users.indexOf(user) < 3
    
    return matchesSearch
  })

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
        <p className="text-text-secondary text-xl">
          See how you rank against other participants
        </p>
      </motion.div>
      
      {/* Top 3 Podium */}
      {users.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Top Performers</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Second Place */}
            {users.length > 1 && (
              <div className="order-2 md:order-1">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white mb-4 border-4 border-gray-400">
                    <span className="text-3xl font-bold">{users[1].displayName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-xl">{users[1].displayName}</h3>
                    <div className="flex items-center justify-center mt-2">
                      <FaMedal className="text-gray-400 mr-2" size={18} />
                      <span className="font-bold text-xl">{users[1].points}</span>
                    </div>
                    <div className="mt-2 text-text-secondary">
                      {users[1].tasksCompleted} tasks
                    </div>
                  </div>
                  <div className="h-20 w-16 bg-gray-400 mt-4 rounded-t-lg flex items-end justify-center">
                    <span className="mb-2 text-white font-bold text-xl">2</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* First Place */}
            <div className="order-1 md:order-2 scale-110 z-10">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white mb-4 border-4 border-yellow-400">
                  <span className="text-4xl font-bold">{users[0].displayName.charAt(0).toUpperCase()}</span>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-2xl">{users[0].displayName}</h3>
                  <div className="flex items-center justify-center mt-2">
                    <FaTrophy className="text-yellow-400 mr-2" size={20} />
                    <span className="font-bold text-2xl">{users[0].points}</span>
                  </div>
                  <div className="mt-2 text-text-secondary">
                    {users[0].tasksCompleted} tasks
                  </div>
                </div>
                <div className="h-28 w-20 bg-yellow-400 mt-4 rounded-t-lg flex items-end justify-center">
                  <span className="mb-2 text-white font-bold text-2xl">1</span>
                </div>
              </div>
            </div>
            
            {/* Third Place */}
            {users.length > 2 && (
              <div className="order-3">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white mb-4 border-4 border-amber-600">
                    <span className="text-3xl font-bold">{users[2].displayName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-xl">{users[2].displayName}</h3>
                    <div className="flex items-center justify-center mt-2">
                      <FaMedal className="text-amber-600 mr-2" size={18} />
                      <span className="font-bold text-xl">{users[2].points}</span>
                    </div>
                    <div className="mt-2 text-text-secondary">
                      {users[2].tasksCompleted} tasks
                    </div>
                  </div>
                  <div className="h-16 w-16 bg-amber-600 mt-4 rounded-t-lg flex items-end justify-center">
                    <span className="mb-2 text-white font-bold text-xl">3</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold">All Participants</h2>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-text-muted" />
              </div>
              <input
                type="text"
                placeholder="Search participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Participants</option>
              <option value="top10">Top 10</option>
              <option value="top3">Top 3</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <LeaderboardCard
                  key={user.uid}
                  user={user}
                  rank={users.indexOf(user) + 1}
                />
              ))
            ) : (
              <div className="card p-8 text-center">
                <p className="text-text-secondary text-lg">No participants found matching your search.</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Leaderboard
