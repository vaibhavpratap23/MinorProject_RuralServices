import { useEffect, useState } from 'react'
import axios from 'axios'

interface JobRow {
  id: number
  title: string
  status: string
  clientName: string
  workerId?: number
  address?: string
  scheduledAt?: string
  createdAt?: string
}

interface WorkerOption { id: number; userId: number; name: string; phone: string }

export default function Jobs() {
  const [jobs, setJobs] = useState<JobRow[]>([])
  const [workers, setWorkers] = useState<WorkerOption[]>([])
  const [selectedWorker, setSelectedWorker] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const [jobsRes, workersRes] = await Promise.all([
        axios.get('/api/admin/jobs'),
        axios.get('/api/admin/workers/verified')
      ])
      setJobs(jobsRes.data)
      setWorkers(workersRes.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const reassign = async (jobId: number) => {
    const workerProfileId = selectedWorker[jobId]
    if (!workerProfileId) return
    await axios.post(`/api/admin/jobs/${jobId}/reassign`, { workerProfileId })
    await load()
  }

  if (loading) return <div className="p-6">Loading jobs...</div>

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Jobs</h1>
      <div className="bg-white rounded-xl shadow border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Title</th>
              <th className="p-3">Client</th>
              <th className="p-3">Status</th>
              <th className="p-3">Worker</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id} className="border-t">
                <td className="p-3">{j.id}</td>
                <td className="p-3">{j.title}</td>
                <td className="p-3">{j.clientName}</td>
                <td className="p-3">{j.status}</td>
                <td className="p-3">
                  <select
                    className="border rounded px-2 py-1"
                    value={selectedWorker[j.id] || ''}
                    onChange={e => setSelectedWorker({ ...selectedWorker, [j.id]: Number(e.target.value) })}
                  >
                    <option value="">Select worker</option>
                    {workers.map(w => (
                      <option key={w.id} value={w.id}>{w.name} ({w.phone})</option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => reassign(j.id)}
                    disabled={!selectedWorker[j.id]}
                    className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
                  >
                    Reassign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
