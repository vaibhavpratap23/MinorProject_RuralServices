import { useEffect, useState } from 'react'
import axios from 'axios'

interface UserRow { id: number; name: string; email?: string; phone: string; role: string; banned?: boolean }

export default function Users() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const res = await axios.get('/api/admin/users')
      setUsers(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const ban = async (userId: number) => { await axios.post(`/api/admin/users/${userId}/ban`); await load() }
  const unban = async (userId: number) => { await axios.post(`/api/admin/users/${userId}/unban`); await load() }

  if (loading) return <div className="p-6">Loading users...</div>

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <div className="bg-white rounded-xl shadow border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.phone}</td>
                <td className="p-3">{u.email || '-'}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => ban(u.id)} className="px-3 py-1 bg-red-600 text-white rounded">Ban</button>
                  <button onClick={() => unban(u.id)} className="px-3 py-1 bg-green-600 text-white rounded">Unban</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
