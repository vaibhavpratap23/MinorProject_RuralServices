import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  Grid,
  List,
  Heart,
  Eye
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  worker: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  tags: string[];
}

const mockServices: Service[] = [
  {
    id: 1,
    title: "Professional House Cleaning",
    description: "Complete home cleaning service including kitchen, bathroom, and living areas. Eco-friendly products used.",
    category: "Cleaning",
    price: 800,
    rating: 4.8,
    reviews: 127,
    location: "Mumbai, Maharashtra",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
    worker: {
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      verified: true
    },
    tags: ["Eco-friendly", "Same day", "Verified"]
  },
  {
    id: 2,
    title: "Electrical Repair & Installation",
    description: "Expert electrical services for home and office. Licensed electrician with 10+ years experience.",
    category: "Electrical",
    price: 1200,
    rating: 4.9,
    reviews: 89,
    location: "Delhi, NCR",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
    worker: {
      name: "Rajesh Kumar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      verified: true
    },
    tags: ["Licensed", "Emergency", "Warranty"]
  },
  {
    id: 3,
    title: "Plumbing Services",
    description: "Complete plumbing solutions including repairs, installations, and maintenance. 24/7 emergency service.",
    category: "Plumbing",
    price: 950,
    rating: 4.7,
    reviews: 156,
    location: "Bangalore, Karnataka",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    worker: {
      name: "Amit Patel",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      verified: true
    },
    tags: ["24/7", "Emergency", "Guaranteed"]
  },
  {
    id: 4,
    title: "Carpentry & Woodwork",
    description: "Custom furniture, repairs, and installations. Quality craftsmanship with premium materials.",
    category: "Carpentry",
    price: 1500,
    rating: 4.6,
    reviews: 73,
    location: "Chennai, Tamil Nadu",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    worker: {
      name: "Suresh Reddy",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      verified: true
    },
    tags: ["Custom", "Premium", "Design"]
  },
  {
    id: 5,
    title: "Painting Services",
    description: "Interior and exterior painting with color consultation. Professional finish guaranteed.",
    category: "Painting",
    price: 2000,
    rating: 4.8,
    reviews: 94,
    location: "Hyderabad, Telangana",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400",
    worker: {
      name: "Lakshmi Devi",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      verified: true
    },
    tags: ["Interior", "Exterior", "Consultation"]
  },
  {
    id: 6,
    title: "Appliance Repair",
    description: "Repair services for all major appliances. Authorized service center with genuine parts.",
    category: "Appliance",
    price: 600,
    rating: 4.5,
    reviews: 112,
    location: "Pune, Maharashtra",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    worker: {
      name: "Vikram Singh",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      verified: true
    },
    tags: ["Authorized", "Genuine Parts", "Warranty"]
  }
];

const categories = [
  "All",
  "Cleaning",
  "Electrical",
  "Plumbing",
  "Carpentry",
  "Painting",
  "Appliance",
  "Gardening",
  "Moving"
];

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [filteredServices, setFilteredServices] = useState<Service[]>(mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'reviews'>('rating');

  useEffect(() => {
    let filtered = services;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.worker.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return a.price - b.price;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory, sortBy]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Find Professional Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with verified professionals for all your home and business needs
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for services, professionals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'gradient' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort and View Options */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border border-white/20 rounded-lg px-3 py-1 text-sm"
              >
                <option value="rating">Rating</option>
                <option value="price">Price</option>
                <option value="reviews">Reviews</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'gradient' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'gradient' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Services Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${filteredServices.length}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={viewMode === 'list' ? 'glass rounded-xl' : ''}
              >
                <Card className={`h-full glass card-hover ${
                  viewMode === 'list' ? 'flex flex-row' : ''
                }`}>
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <div className="relative">
                      <img
                        src={service.image}
                        alt={service.title}
                        className={`w-full object-cover ${
                          viewMode === 'list' ? 'h-32 w-48 rounded-l-xl' : 'h-48 rounded-t-xl'
                        }`}
                      />
                      <div className="absolute top-3 right-3">
                        <Button variant="ghost" size="sm" className="glass">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                          {renderStars(service.rating)}
                          <span className="text-white text-xs ml-1">{service.rating}</span>
                        </div>
                      </div>
                    </div>

                    <CardHeader className={viewMode === 'list' ? 'flex-1' : ''}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{service.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mb-3">
                            {service.description}
                          </CardDescription>
                        </div>
                      </div>

                      {/* Worker Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={service.worker.avatar}
                          alt={service.worker.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{service.worker.name}</p>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{service.location}</span>
                            {service.worker.verified && (
                              <span className="text-xs bg-green-500 text-white px-1 rounded">✓</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {service.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-xl font-bold">₹{service.price}</span>
                          <span className="text-sm text-muted-foreground">/service</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="gradient" size="sm">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all categories
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Services;
