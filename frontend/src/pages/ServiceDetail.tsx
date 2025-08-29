import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  MapPin, 
  Clock, 
  DollarSign, 
  Phone, 
  MessageCircle,
  Calendar,
  CheckCircle,
  Shield,
  Award,
  Heart,
  Share2,
  ArrowLeft,
  User,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

interface Review {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface ServiceDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  reviews: Review[];
  location: string;
  images: string[];
  worker: {
    name: string;
    avatar: string;
    verified: boolean;
    experience: string;
    completedJobs: number;
    responseTime: string;
    phone: string;
  };
  tags: string[];
  features: string[];
  availability: string[];
  cancellation: string;
}

const mockServiceDetail: ServiceDetail = {
  id: 1,
  title: "Professional House Cleaning Service",
  description: "Complete home cleaning service including kitchen, bathroom, living areas, and bedrooms. We use eco-friendly products and follow strict hygiene protocols. Our team is trained, insured, and background verified for your peace of mind.",
  category: "Cleaning",
  price: 800,
  rating: 4.8,
  reviews: [
    {
      id: 1,
      user: {
        name: "Rahul Sharma",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
      },
      rating: 5,
      comment: "Excellent service! The team was professional, punctual, and did an amazing job. My house looks spotless.",
      date: "2024-01-15",
      helpful: 12
    },
    {
      id: 2,
      user: {
        name: "Priya Patel",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100"
      },
      rating: 4,
      comment: "Good service overall. The cleaning was thorough and they used eco-friendly products as promised.",
      date: "2024-01-10",
      helpful: 8
    }
  ],
  location: "Mumbai, Maharashtra",
  images: [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800"
  ],
  worker: {
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
    verified: true,
    experience: "5+ years",
    completedJobs: 127,
    responseTime: "< 1 hour",
    phone: "+91 98765 43210"
  },
  tags: ["Eco-friendly", "Same day", "Verified", "Insured"],
  features: [
    "Deep cleaning of all rooms",
    "Kitchen and bathroom sanitization",
    "Eco-friendly cleaning products",
    "Furniture and appliance cleaning",
    "Window and glass cleaning",
    "Floor mopping and vacuuming"
  ],
  availability: [
    "Monday - Friday: 9:00 AM - 6:00 PM",
    "Saturday: 9:00 AM - 4:00 PM",
    "Sunday: 10:00 AM - 2:00 PM"
  ],
  cancellation: "Free cancellation up to 2 hours before the scheduled time"
};

const ServiceDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showBooking, setShowBooking] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const service = mockServiceDetail; // In real app, fetch by id

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }
    // Handle booking logic
    console.log('Booking:', { date: selectedDate, time: selectedTime });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Services
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="relative">
                <img
                  src={service.images[selectedImage]}
                  alt={service.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="glass"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="sm" className="glass">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Thumbnail Images */}
              <div className="p-4 flex gap-2 overflow-x-auto">
                {service.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${service.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Service Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {renderStars(service.rating)}
                      <span className="ml-1">{service.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{service.reviews.length} reviews</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{service.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">₹{service.price}</div>
                  <div className="text-sm text-muted-foreground">per service</div>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{service.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">What's included</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Worker Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">About the Professional</h3>
              <div className="flex items-start gap-4">
                <img
                  src={service.worker.avatar}
                  alt={service.worker.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{service.worker.name}</h4>
                    {service.worker.verified && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Experience</div>
                      <div className="font-medium">{service.worker.experience}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Jobs Completed</div>
                      <div className="font-medium">{service.worker.completedJobs}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Response Time</div>
                      <div className="font-medium">{service.worker.responseTime}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Rating</div>
                      <div className="font-medium">{service.rating} ⭐</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Reviews</h3>
              <div className="space-y-4">
                {service.reviews.map((review) => (
                  <div key={review.id} className="border-b border-white/10 pb-4 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <img
                        src={review.user.avatar}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{review.user.name}</span>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{review.date}</span>
                          <button className="flex items-center gap-1 hover:text-foreground">
                            <ThumbsUp className="w-3 h-3" />
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Booking Card */}
            <Card className="glass sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Book Service</span>
                  <span className="text-2xl font-bold text-primary">₹{service.price}</span>
                </CardTitle>
                <CardDescription>Select your preferred date and time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Time</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-transparent border border-white/20 rounded-lg px-3 py-2"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                </div>

                <Button
                  variant="gradient"
                  className="w-full"
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime}
                >
                  Book Now
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  {service.cancellation}
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {service.availability.map((time, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {time}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Guarantees */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Our Guarantees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">100% Satisfaction Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Verified Professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">24/7 Support</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
