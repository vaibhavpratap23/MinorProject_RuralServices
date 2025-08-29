import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { motion } from 'framer-motion'
import { 
  Home, 
  Users, 
  BookOpen, 
  Wrench, 
  Heart, 
  Car, 
  Camera, 
  Zap,
  ArrowRight,
  Star,
  CheckCircle,
  MapPin
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

const categories = [
  { name: "Maids & Helpers", icon: Home, description: "Full-time, cleaning, cooking maids", color: "from-blue-500 to-cyan-500" },
  { name: "Food Services", icon: Heart, description: "Home cooks, tiffin services", color: "from-orange-500 to-red-500" },
  { name: "Education", icon: BookOpen, description: "Tutors, music, dance teachers", color: "from-purple-500 to-pink-500" },
  { name: "Tech Repairs", icon: Wrench, description: "Mobile, laptop, appliance repairs", color: "from-green-500 to-emerald-500" },
  { name: "Personal Care", icon: Heart, description: "Beauticians, massage, fitness", color: "from-pink-500 to-rose-500" },
  { name: "Vehicle Care", icon: Car, description: "Car cleaning, drivers, mechanics", color: "from-indigo-500 to-blue-500" },
  { name: "Events", icon: Camera, description: "Photography, decoration, catering", color: "from-yellow-500 to-orange-500" },
  { name: "Home Repairs", icon: Zap, description: "Electrical, plumbing, painting", color: "from-red-500 to-pink-500" }
]

const steps = [
  {
    number: "1",
    title: "Post a Job",
    description: "Describe what you need and set your budget",
    icon: CheckCircle
  },
  {
    number: "2", 
    title: "Get Matched",
    description: "Verified workers will accept your job",
    icon: Users
  },
  {
    number: "3",
    title: "Job Done", 
    description: "Pay only after the work is completed",
    icon: Star
  }
]

export default function Landing() {
  const { user, token } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="gradient-text">Rural Services</span>
              <br />
              <span className="text-foreground">at your doorstep</span>
            </motion.h1>
            
            {!token ? (
              <>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
                >
                  From quick repairs to construction jobs, connect with verified workers and get the job done. 
                  Trusted by thousands of customers across rural India.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                >
                  <Button variant="gradient" size="lg" className="text-lg px-8 py-4">
                    <Link to="/client">Post a Job</Link>
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                    <Link to="/worker">Find Gigs</Link>
                  </Button>
                </motion.div>
                
                {/* Stats */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">4.8</div>
                    <div className="text-sm text-muted-foreground">Service Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">10K+</div>
                    <div className="text-sm text-muted-foreground">Verified Workers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">50K+</div>
                    <div className="text-sm text-muted-foreground">Jobs Completed</div>
                  </div>
                </motion.div>
              </>
            ) : (
              <>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
                >
                  Welcome back, {user?.name?.split(' ')[0]}! 
                  {user?.role === 'CLIENT' ? ' What service do you need today?' : ' Ready to find your next gig?'}
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                >
                  {user?.role === 'CLIENT' ? (
                    <Button variant="gradient" size="lg" className="text-lg px-8 py-4">
                      <Link to="/client">Go to Dashboard</Link>
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  ) : user?.role === 'WORKER' ? (
                    <Button variant="gradient" size="lg" className="text-lg px-8 py-4">
                      <Link to="/worker">Find Jobs Near You</Link>
                      <MapPin className="ml-2 w-5 h-5" />
                    </Button>
                  ) : null}
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">What are you looking for?</h2>
            <p className="text-muted-foreground text-lg">Choose from our wide range of professional services</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Link 
                    to={token && user?.role === 'CLIENT' ? "/client" : token && user?.role === 'WORKER' ? "/worker" : "/client"}
                  >
                    <Card className="h-full text-center hover:shadow-xl transition-all duration-300 group">
                      <CardHeader>
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {category.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          {category.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">How it works</h2>
            <p className="text-muted-foreground text-lg">Get your job done in 3 simple steps</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 animate-float">
                        {step.number}
                      </div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}


