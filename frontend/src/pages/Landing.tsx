import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { motion } from 'framer-motion'
import {
  Plug,
  Droplets,
  Hammer,
  Building2,
  Bug,
  Leaf,
  Paintbrush,
  Tv2,
  Home,
  Car,
  Boxes,
  ArrowRight,
  MapPin
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useState } from 'react'

const categories = [
  { name: 'Electrical & Electronics', icon: Plug, description: 'Wiring, fan, TV, fridge repairs', color: 'from-yellow-500 to-amber-600' },
  { name: 'Plumbing & Water', icon: Droplets, description: 'Taps, leaks, tank cleaning', color: 'from-blue-500 to-cyan-600' },
  { name: 'Carpentry & Furniture', icon: Hammer, description: 'Repairs, assembly, custom work', color: 'from-amber-600 to-orange-600' },
  { name: 'Construction & Civil Work', icon: Building2, description: 'Mason, tiles, roofing', color: 'from-slate-600 to-slate-800' },
  { name: 'Home Cleaning & Pest Control', icon: Bug, description: 'Deep clean, pest control', color: 'from-rose-500 to-pink-600' },
  { name: 'Gardening & Outdoor', icon: Leaf, description: 'Lawn, plants, landscaping', color: 'from-green-500 to-emerald-600' },
  { name: 'Painting & Interior Decor', icon: Paintbrush, description: 'Interior, exterior, POP', color: 'from-purple-500 to-fuchsia-600' },
  { name: 'Home Appliances Installation', icon: Tv2, description: 'AC, TV, RO, inverter', color: 'from-indigo-500 to-blue-600' },
  { name: 'Household Help', icon: Home, description: 'Maid, cook, caregiver', color: 'from-teal-500 to-emerald-600' },
  { name: 'Vehicles (Optional Expansion)', icon: Car, description: 'Mechanic, driver, detailing', color: 'from-sky-500 to-blue-600' },
  { name: 'Miscellaneous Household Services', icon: Boxes, description: 'Odd jobs, shifting', color: 'from-stone-500 to-zinc-600' }
]

export default function Landing() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'customer' | 'worker'>('customer')
  const [phone, setPhone] = useState('')
  const [locationFile, setLocationFile] = useState<File | null>(null)
  const [workerForm, setWorkerForm] = useState({
    name: '',
    phone: '',
    email: '',
    skills: '',
    experience: '',
    serviceLocation: '',
    idProofFile: null as File | null
  })

  const handleWorkerInput = (key: string, value: string | File | null) => {
    setWorkerForm(prev => ({ ...prev, [key]: value }))
  }

  // If already logged in, redirect to respective dashboards
  if (token && user?.role === 'CLIENT') {
    navigate('/client')
  } else if (token && user?.role === 'WORKER') {
    navigate('/worker')
  } else if (token && user?.role === 'ADMIN') {
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Two-column Landing */}
      <section className="relative overflow-hidden py-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Categories */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Find services by category</h2>
              <p className="text-muted-foreground mb-6">Browse popular household and professional services</p>
              <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-2">
                {categories.map((c, idx) => {
                  const Icon = c.icon
                  return (
                    <Card key={c.name} className="group hover:shadow-md transition-all">
                      <CardHeader className="pb-2">
                        <div className={`w-12 h-12 rounded-md bg-gradient-to-r ${c.color} flex items-center justify-center text-white`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <CardTitle className="mt-2 text-base">{c.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm">{c.description}</CardDescription>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Right: Auth Panels */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get started</h2>
              <div className="flex gap-2 mb-6">
                <Button variant={activeTab === 'customer' ? 'gradient' : 'outline'} onClick={() => setActiveTab('customer')}>Customer Login</Button>
                <Button variant={activeTab === 'worker' ? 'gradient' : 'outline'} onClick={() => setActiveTab('worker')}>Worker Login</Button>
              </div>

              {activeTab === 'customer' ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Login as Customer</CardTitle>
                    <CardDescription>Use Gmail/Phone and share your location</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">Continue with Gmail</Button>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-sm mb-1 block">Phone number</label>
                        <Input placeholder="Enter phone number" value={phone} onChange={e => setPhone(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm mb-1 block">Upload location (file)</label>
                        <Input type="file" onChange={e => setLocationFile(e.target.files?.[0] ?? null)} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Login</Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <Link to="/pages/auth/Login">Advanced login</Link>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Not registered? <Link to="/register" className="underline">Create an account</Link>
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Login as Worker</CardTitle>
                    <CardDescription>Enter your details to access your dashboard</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm mb-1 block">Name</label>
                        <Input placeholder="Full name" value={workerForm.name} onChange={e => handleWorkerInput('name', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm mb-1 block">Phone</label>
                        <Input placeholder="Phone number" value={workerForm.phone} onChange={e => handleWorkerInput('phone', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm mb-1 block">Email</label>
                        <Input placeholder="Email address" value={workerForm.email} onChange={e => handleWorkerInput('email', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm mb-1 block">Skills</label>
                        <Input placeholder="e.g. Plumbing, Electrical" value={workerForm.skills} onChange={e => handleWorkerInput('skills', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm mb-1 block">Experience (years)</label>
                        <Input placeholder="e.g. 3" value={workerForm.experience} onChange={e => handleWorkerInput('experience', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-sm mb-1 block">Serviceable location</label>
                        <Input placeholder="City/Area" value={workerForm.serviceLocation} onChange={e => handleWorkerInput('serviceLocation', e.target.value)} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm mb-1 block">ID proof (photo holding ID)</label>
                        <Input type="file" onChange={e => handleWorkerInput('idProofFile', e.target.files?.[0] ?? null)} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Login</Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <Link to="/pages/auth/Login">Advanced login</Link>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Not registered? <Link to="/register" className="underline">Register now</Link>
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* (Optional) additional sections can follow below */}

      
    </div>
  )
}


