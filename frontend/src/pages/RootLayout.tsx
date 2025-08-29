import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}


