import { useEffect, useState } from 'react'
import axios from 'axios'

interface Report { id: number; reportedUser: string; reason: string; status: string; createdAt: string }

export default function Disputes() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const res = await axios.get('/api/admin/fraud/reports')
        setReports(res.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="p-6">Loading disputes...</div>

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Disputes</h1>
      <div className="bg-white rounded-xl shadow border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Reported User</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-3">{r.id}</td>
                <td className="p-3">{r.reportedUser}</td>
                <td className="p-3">{r.reason}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3">{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
