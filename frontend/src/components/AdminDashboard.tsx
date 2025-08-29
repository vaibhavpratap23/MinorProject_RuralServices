import { useState, useEffect } from 'react'
import axios from 'axios'

type DashboardStats = {
  totalJobs: number
  jobsToday: number
  jobsThisMonth: number
  completedJobs: number
  totalUsers: number
  totalWorkers: number
  verifiedWorkers: number
  mostPopularCategory: string
  timeseries?: Array<{ date: string; jobs: number }>
}

type HeatmapPoint = {
  lat: number
  lng: number
  count: number
}

type UserRow = { id: number; name: string; email: string; phone: string; role: string }
type CategoryRow = { id: number; name: string }

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'fraud' | 'users' | 'services'>('overview')
  const [users, setUsers] = useState<UserRow[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, heatmapRes] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/jobs/heatmap')
      ])
      setStats(statsRes.data)
      setHeatmapData(heatmapRes.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const fetchUsers = async () => {
    try { const res = await axios.get('/api/admin/users'); setUsers(res.data) } catch (e) { console.error(e) }
  }

  const fetchCategories = async () => {
    try { const res = await axios.get('/api/admin/categories'); setCategories(res.data) } catch (e) { console.error(e) }
  }

  if (!stats) {
    return <div className="text-center py-8">Loading dashboard...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor platform performance and manage users</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('fraud')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'fraud'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Fraud Detection
            </button>
            <button
              onClick={() => { setActiveTab('users'); fetchUsers() }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => { setActiveTab('services'); fetchCategories() }}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Services
            </button>
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Jobs Today</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.jobsToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified Workers</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.verifiedWorkers}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Heatmap</h3>
            <div className="space-y-2">
              {heatmapData.map((point, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">
                    {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{point.count} jobs</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
            <div className="text-center py-8">
              <div className="text-2xl font-bold text-blue-600">{stats.mostPopularCategory}</div>
              <div className="text-sm text-gray-600">Most Popular Category</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Jobs Trend</h3>
            <div className="w-full">
              <svg viewBox="0 0 600 200" className="w-full h-40">
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  points={(stats.timeseries || []).map((p, i) => `${i * 600/ Math.max(1,(stats.timeseries||[]).length-1)},${200 - p.jobs*10}`).join(' ')}
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Fraud Detection Tab */}
      {activeTab === 'fraud' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fraud Reports</h3>
          <div className="text-center py-8 text-gray-500">
            No fraud reports at the moment
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Users</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="p-2">ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Phone</th>
                  <th className="p-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-t">
                    <td className="p-2">{u.id}</td>
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.phone}</td>
                    <td className="p-2">{u.role}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td className="p-4 text-gray-500" colSpan={5}>No users</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Services (Categories)</h3>
          <div className="flex gap-2">
            <input value={newCategory} onChange={(e)=>setNewCategory(e.target.value)} placeholder="New category name" className="border px-3 py-2 rounded w-full" />
            <button onClick={async ()=>{ if(!newCategory.trim()) return; await axios.post('/api/admin/categories',{name:newCategory}); setNewCategory(''); fetchCategories() }} className="px-3 py-2 bg-blue-600 text-white rounded">Add</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="p-2">ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id} className="border-t">
                    <td className="p-2">{c.id}</td>
                    <td className="p-2">
                      <input defaultValue={c.name} onBlur={async (e)=>{ const name=e.target.value; await axios.put(`/api/admin/categories/${c.id}`,{name}); fetchCategories() }} className="border px-2 py-1 rounded" />
                    </td>
                    <td className="p-2">
                      <button onClick={async ()=>{ await axios.delete(`/api/admin/categories/${c.id}`); fetchCategories() }} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr><td className="p-4 text-gray-500" colSpan={3}>No categories</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
