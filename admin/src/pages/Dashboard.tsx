import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Users, 
  Briefcase, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  ArrowRight,
  DollarSign,
  MapPin,
  Star
} from 'lucide-react'
import axios from 'axios'

interface DashboardStats {
  totalJobs: number
  totalUsers: number
  totalWorkers: number
  verifiedWorkers: number
  pendingVerifications: number
  totalRevenue: number
  activeJobs: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    totalUsers: 0,
    totalWorkers: 0,
    verifiedWorkers: 0,
    pendingVerifications: 0,
    totalRevenue: 0,
    activeJobs: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }

        const [dashboardRes, pendingRes] = await Promise.all([
          axios.get('/api/admin/dashboard'),
          axios.get('/api/admin/workers/pending')
        ])

        setStats({
          ...dashboardRes.data,
          pendingVerifications: pendingRes.data.length,
          totalRevenue: 125000, // Mock data
          activeJobs: 45 // Mock data
        })
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
        // Set mock data for demo
        setStats({
          totalJobs: 156,
          totalUsers: 89,
          totalWorkers: 67,
          verifiedWorkers: 52,
          pendingVerifications: 15,
          totalRevenue: 125000,
          activeJobs: 45
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Workers',
      value: stats.totalWorkers,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Verified Workers',
      value: stats.verifiedWorkers,
      icon: CheckCircle,
      color: 'from-yellow-500 to-orange-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: Clock,
      color: 'from-indigo-500 to-blue-500',
      change: '+3%',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats.totalRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'from-red-500 to-pink-500',
      change: '+18%',
      changeType: 'positive'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'worker_registration',
      message: 'New worker registration from Mumbai',
      time: '2 hours ago',
      status: 'pending',
      icon: Users
    },
    {
      id: 2,
      type: 'job_posted',
      message: 'Job posted: Plumbing repair in Delhi',
      time: '4 hours ago',
      status: 'active',
      icon: Briefcase
    },
    {
      id: 3,
      type: 'verification_completed',
      message: 'Worker verification completed',
      time: '6 hours ago',
      status: 'completed',
      icon: CheckCircle
    },
    {
      id: 4,
      type: 'payment_received',
      message: 'Payment received for cleaning service',
      time: '8 hours ago',
      status: 'completed',
      icon: DollarSign
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your platform</p>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-6 card-hover"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm ${
                        stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">from last month</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/workers"
              className="group relative block w-full border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300 hover:bg-white/5"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-lg font-medium mb-2">Worker Verification</div>
              <div className="text-sm text-muted-foreground mb-4">
                {stats.pendingVerifications} workers pending verification
              </div>
              {stats.pendingVerifications > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                  {stats.pendingVerifications}
                </div>
              )}
              <div className="flex items-center justify-center text-primary text-sm font-medium">
                Manage Workers
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <div className="relative block w-full border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-lg font-medium mb-2">System Reports</div>
              <div className="text-sm text-muted-foreground mb-4">
                View platform analytics and reports
              </div>
              <div className="text-primary text-sm font-medium">
                View Reports
                <ArrowRight className="w-4 h-4 ml-1 inline" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.status === 'completed' ? 'bg-green-500/20' :
                    activity.status === 'pending' ? 'bg-yellow-500/20' :
                    'bg-blue-500/20'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      activity.status === 'completed' ? 'text-green-500' :
                      activity.status === 'pending' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                    activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-blue-500/20 text-blue-500'
                  }`}>
                    {activity.status}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
