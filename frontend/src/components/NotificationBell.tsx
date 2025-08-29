import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Button } from './ui/Button';

export const NotificationBell: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUnreadCount = () => {
      // In real app, call API to get unread notifications count
      // axios.get('/api/notifications/count/unread')
      //   .then(r => setUnreadCount(r.data.unreadCount))
      //   .catch(() => {})
      
      // Mock data
      setUnreadCount(3);
    };
    
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg glass hover:bg-white/20 transition-colors duration-200"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 glass rounded-lg shadow-xl border border-white/10 backdrop-blur-xl z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {unreadCount > 0 ? (
                  <>
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-medium">New job request</p>
                      <p className="text-xs text-muted-foreground">Plumbing service in your area</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-muted-foreground">₹800 for cleaning service</p>
                      <p className="text-xs text-muted-foreground mt-1">4 hours ago</p>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-medium">Job completed</p>
                      <p className="text-xs text-muted-foreground">Electrical repair marked as done</p>
                      <p className="text-xs text-muted-foreground mt-1">6 hours ago</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No new notifications</p>
                  </div>
                )}
              </div>
              
              {unreadCount > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Button variant="outline" size="sm" className="w-full">
                    Mark all as read
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
