import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import RootLayout from './pages/RootLayout'
import { AuthProvider } from './lib/auth'
import { ThemeProvider } from './lib/theme'
import { ToastProvider } from './hooks/useToast'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ClientDashboard from './pages/client/ClientDashboard'
import WorkerDashboard from './pages/worker/WorkerDashboard'
import Profile from './pages/Profile'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import AdminDashboard from './components/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'client', element: (
        <ProtectedRoute allow={['CLIENT','ADMIN']}>
          <ClientDashboard />
        </ProtectedRoute>
      ) },
      { path: 'worker', element: (
        <ProtectedRoute allow={['WORKER','ADMIN']}>
          <WorkerDashboard />
        </ProtectedRoute>
      ) },
      { path: 'profile', element: <Profile /> },
      { path: 'services', element: <Services /> },
      { path: 'service/:id', element: <ServiceDetail /> },
      { path: 'admin', element: (
        <ProtectedRoute allow={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      ) },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
)


