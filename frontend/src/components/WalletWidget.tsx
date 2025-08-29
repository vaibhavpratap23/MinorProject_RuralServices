import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/Button';

interface WalletWidgetProps {
  className?: string;
}

export const WalletWidget: React.FC<WalletWidgetProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch wallet balance
    const fetchBalance = async () => {
      try {
        // In real app, call API to get wallet balance
        // const response = await axios.get('/api/wallet/balance');
        // setBalance(response.data.balance);
        setBalance(1250); // Mock data
      } catch (error) {
        console.error('Failed to fetch wallet balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg glass hover:bg-white/20 transition-colors duration-200"
      >
        <Wallet className="w-5 h-5 text-muted-foreground" />
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium">
            {loading ? '...' : `₹${balance.toLocaleString()}`}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-64 glass rounded-lg shadow-xl border border-white/10 backdrop-blur-xl z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Wallet Balance</h3>
                <span className="text-lg font-bold text-green-500">
                  ₹{balance.toLocaleString()}
                </span>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Add Money
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Wallet className="w-4 h-4 mr-2" />
                  View Transactions
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
