import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react'
import axios from 'axios'
import JobCard from '../../components/JobCard'
import JobFilters, { JobFilters as JobFiltersType } from '../../components/JobFilters'
import { Button } from '../../components/ui/Button'

type Job = { 
  id: number; 
  title: string; 
  description?: string;
  status: string; 
  budget?: number;
  categoryName?: string;
  address?: string;
  createdAt?: string;
}

export default function WorkerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [myJobs, setMyJobs] = useState<Job[]>([])
  const [activeTab, setActiveTab] = useState<'available' | 'my-jobs'>('available')
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      // Fetch jobs near worker's location based on their radius
      const [nearbyResponse, myJobsResponse, categoriesResponse] = await Promise.all([
        axios.get('/api/jobs/worker/nearby'),
        axios.get('/api/jobs/me'),
        axios.get('/api/jobs/categories')
      ])
      
      setJobs(nearbyResponse.data)
      setFilteredJobs(nearbyResponse.data)
      setMyJobs(myJobsResponse.data)
      
      const allCategories = Object.values(categoriesResponse.data).flat() as string[]
      setCategories(allCategories)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshJobs = async () => {
    setRefreshing(true)
    try {
      const [nearbyResponse, myJobsResponse] = await Promise.all([
        axios.get('/api/jobs/worker/nearby'),
        axios.get('/api/jobs/me')
      ])
      
      setJobs(nearbyResponse.data)
      setFilteredJobs(nearbyResponse.data)
      setMyJobs(myJobsResponse.data)
    } catch (error) {
      console.error('Failed to refresh jobs:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleFilterChange = (filters: JobFiltersType) => {
    let filtered = [...jobs]
    
    // Category filter
    if (filters.category) {
      filtered = filtered.filter(job => job.categoryName === filters.category)
    }
    
    // Budget filter
    filtered = filtered.filter(job => 
      job.budget && job.budget >= filters.minBudget && job.budget <= filters.maxBudget
    )
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      switch (filters.sortBy) {
        case 'budget':
          comparison = (a.budget || 0) - (b.budget || 0)
          break
        case 'date':
          comparison = new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime()
          break
        default:
          comparison = 0
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison
    })
    
    setFilteredJobs(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'text-green-500 bg-green-500/10'
      case 'ASSIGNED': return 'text-blue-500 bg-blue-500/10'
      case 'IN_PROGRESS': return 'text-yellow-500 bg-yellow-500/10'
      case 'COMPLETED': return 'text-purple-500 bg-purple-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Worker Dashboard</h1>
            <p className="text-muted-foreground">Find gigs and manage your work</p>
          </div>
          <Button
            variant="outline"
            onClick={refreshJobs}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Jobs</p>
                <p className="text-2xl font-bold">{filteredJobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Jobs</p>
                <p className="text-2xl font-bold">{myJobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">₹{myJobs.reduce((sum, job) => sum + (job.budget || 0), 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="glass rounded-xl p-1">
            <div className="flex">
              <button
                onClick={() => setActiveTab('available')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  activeTab === 'available'
                    ? 'gradient-bg text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Available Jobs ({filteredJobs.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('my-jobs')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                  activeTab === 'my-jobs'
                    ? 'gradient-bg text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  My Jobs ({myJobs.length})
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'available' && (
            <motion.div
              key="available"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <JobFilters onFilterChange={handleFilterChange} categories={categories} />
              
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading available jobs...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <JobCard job={job} onUpdate={refreshJobs} />
                    </motion.div>
                  ))}
                  {filteredJobs.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full text-center py-12"
                    >
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold mb-2">No jobs match your filters</h3>
                      <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
                      <Button variant="outline" onClick={() => setFilteredJobs(jobs)}>
                        Show All Jobs
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'my-jobs' && (
            <motion.div
              key="my-jobs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <JobCard job={job} onUpdate={refreshJobs} showActions={false} />
                  </motion.div>
                ))}
                {myJobs.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-12"
                  >
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold mb-2">You haven't accepted any jobs yet</h3>
                    <p className="text-muted-foreground mb-4">Browse available gigs to get started</p>
                    <Button 
                      variant="gradient" 
                      onClick={() => setActiveTab('available')}
                    >
                      Browse Jobs
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}


