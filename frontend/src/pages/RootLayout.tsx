import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function RootLayout() {
  const location = useLocation()
  const hideNavbar = location.pathname === '/'
  return (
    <div className="min-h-screen bg-background">
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? '' : 'pt-16'}>
        <Outlet />
      </main>
    </div>
  )
}


