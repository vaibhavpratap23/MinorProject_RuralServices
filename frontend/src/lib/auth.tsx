import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'

type User = { id: number; name: string; email?: string; phone?: string; role: 'CLIENT'|'WORKER'|'ADMIN' }

type AuthCtx = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  sendOtp: (phoneNumber: string) => Promise<string | void>
  verifyOtp: (phoneNumber: string, otp: string) => Promise<void>
  logout: () => void
}

const Ctx = createContext<AuthCtx>({ user: null, token: null, async login() {}, async sendOtp() {}, async verifyOtp() {}, logout() {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t) {
      setToken(t)
      axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
    }
    if (u) setUser(JSON.parse(u))
  }, [])

  const login = async (email: string, password: string) => {
    const res = await axios.post('/api/auth/login', { email, password })
    const t: string = res.data.token
    const u: User = res.data.user
    setToken(t); setUser(u)
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(u))
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
  }

  const sendOtp = async (phoneNumber: string) => {
    const res = await axios.post('/api/auth/send-otp', { phoneNumber })
    return res.data?.otp
  }

  const verifyOtp = async (phoneNumber: string, otp: string) => {
    const res = await axios.post('/api/auth/verify-otp', { phoneNumber, otp })
    const t: string = res.data.token
    const u: User = res.data.user
    setToken(t); setUser(u)
    localStorage.setItem('token', t)
    localStorage.setItem('user', JSON.stringify(u))
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`
  }

  const logout = () => {
    setToken(null); setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  return <Ctx.Provider value={{ user, token, login, sendOtp, verifyOtp, logout }}>{children}</Ctx.Provider>
}

export function useAuth() { return useContext(Ctx) }


