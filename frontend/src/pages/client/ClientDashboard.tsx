import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign,
  Clock,
  CheckCircle,
  X,
  Edit,
  Eye,
  Star
} from 'lucide-react'
import axios from 'axios'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'

type Category = { id: number; name: string }
type Job = { 
  id: number; 
  title: string; 
  status: string; 
  budget?: number;
  description?: string;
  address?: string;
  createdAt?: string;
  category?: string;
}

export default function ClientDashboard() {
  const [jobCategories, setJobCategories] = useState<any>({})
  const [jobs, setJobs] = useState<Job[]>([])
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    categoryId: '', 
    budget: '', 
    address: '',
    selectedCategory: '',
    customJob: ''
  })
  const [showCustom, setShowCustom] = useState(false)
  const [showJobForm, setShowJobForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => {
    // Fetch comprehensive job categories
    axios.get('/api/jobs/categories').then(r => setJobCategories(r.data)).catch(() => {})
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    axios.get('/api/jobs/me').then(r => setJobs(r.data)).catch(()=>{})
  }, [])

  const postJob = async () => {
    try {
      setLoading(true)
      const jobTitle = showCustom ? form.customJob : form.selectedCategory
      const payload = {
        title: jobTitle || form.title,
        description: form.description,
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        budget: form.budget ? Number(form.budget) : undefined,
        address: form.address
      }
      const res = await axios.post('/api/jobs', payload)
      setJobs([res.data, ...jobs])
      setForm({ 
        title: '', 
        description: '', 
        categoryId: '', 
        budget: '', 
        address: '',
        selectedCategory: '',
        customJob: ''
      })
      setShowCustom(false)
      setShowJobForm(false)
    } catch (e: any) {
      alert(e?.response?.data || 'Failed to post job. Make sure you are logged in.')
    } finally {
      setLoading(false)
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <Clock className="w-4 h-4" />
      case 'ASSIGNED': return <CheckCircle className="w-4 h-4" />
      case 'IN_PROGRESS': return <Clock className="w-4 h-4" />
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
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
            <h1 className="text-3xl font-bold gradient-text mb-2">Client Dashboard</h1>
            <p className="text-muted-foreground">Manage your jobs and find professionals</p>
          </div>
          <Button
            variant="gradient"
            onClick={() => setShowJobForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Post New Job
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-6 sticky top-24"
            >
              <h2 className="text-xl font-semibold mb-6">Post a Job</h2>
              
              <div className="space-y-6">
                {/* Job Category Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Select Job Type</label>
                  <div className="space-y-3">
                    {Object.entries(jobCategories).map(([category, jobs]: [string, any]) => (
                      <div key={category} className="border border-white/20 rounded-lg p-3">
                        <h4 className="font-medium text-foreground mb-2 capitalize">{category}</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {Array.isArray(jobs) && jobs.slice(0, 4).map((job: string, index: number) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setForm({ ...form, selectedCategory: job })}
                              className={`text-sm p-2 border rounded-lg text-left transition-all ${
                                form.selectedCategory === job 
                                  ? 'bg-primary/10 border-primary text-primary' 
                                  : 'bg-transparent border-white/20 hover:bg-white/5'
                              }`}
                            >
                              {job}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowCustom(!showCustom)}
                    className="text-sm text-primary underline mt-2"
                  >
                    {showCustom ? 'Choose from categories' : 'Enter custom job description'}
                  </button>
                </div>

                {showCustom ? (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Custom Job Description</label>
                    <Input 
                      placeholder="Describe your job requirement" 
                      value={form.customJob} 
                      onChange={e => setForm({ ...form, customJob: e.target.value })} 
                    />
                  </div>
                ) : (
                  form.selectedCategory && (
                    <div className="text-sm text-green-500 bg-green-500/10 p-3 rounded-lg">
                      ✅ Selected: {form.selectedCategory}
                    </div>
                  )
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">Additional Details</label>
                  <textarea 
                    placeholder="Provide more details about the job" 
                    value={form.description} 
                    onChange={e => setForm({ ...form, description: e.target.value })} 
                    rows={3}
                    className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2 resize-none"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Budget (₹)</label>
                  <Input 
                    placeholder="Enter your budget" 
                    type="number"
                    value={form.budget} 
                    onChange={e => setForm({ ...form, budget: e.target.value })} 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Address/Location</label>
                  <Input 
                    placeholder="Enter job location" 
                    value={form.address} 
                    onChange={e => setForm({ ...form, address: e.target.value })} 
                  />
                </div>
                
                <Button 
                  variant="gradient"
                  onClick={postJob}
                  disabled={!form.selectedCategory && !form.customJob || loading}
                  className="w-full"
                >
                  {loading ? 'Posting...' : 'Post Job'}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-semibold mb-6">My Jobs</h2>
              
              <div className="space-y-4">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="glass rounded-xl p-6 card-hover"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(job.status)}`}>
                            {getStatusIcon(job.status)}
                            {job.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        {job.description && (
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {job.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {job.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.address}</span>
                            </div>
                          )}
                          {job.createdAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                            </div>
                          )}
                          {job.budget && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span>₹{job.budget}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {jobs.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold mb-2">No jobs posted yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Post your first job to get started!
                    </p>
                    <Button
                      variant="gradient"
                      onClick={() => setShowJobForm(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Post Your First Job
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}


