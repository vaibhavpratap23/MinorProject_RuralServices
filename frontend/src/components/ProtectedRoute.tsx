import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

type Props = {
  allow: Array<'CLIENT' | 'WORKER' | 'ADMIN'>
  children: React.ReactNode
}

export default function ProtectedRoute({ allow, children }: Props) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!allow.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}


