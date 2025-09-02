import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">About Rural Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connecting skilled workers with local communities to provide essential services
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-foreground">Our Mission</h2>
            <p className="text-muted-foreground">
              At Rural Services, we're dedicated to bridging the gap between skilled workers and local communities. 
              Our platform makes it easy to find reliable help for all your service needs, from home repairs to 
              specialized tasks.
            </p>
            <p className="text-muted-foreground">
              We believe in supporting local economies and providing fair opportunities for skilled workers 
              to showcase their talents and grow their businesses.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-muted/20 p-8 rounded-xl"
          >
            <h3 className="text-xl font-semibold text-foreground mb-4">Why Choose Us?</h3>
            <ul className="space-y-4">
              {[
                'Verified service providers',
                'Secure payment system',
                'Real-time job tracking',
                'Customer reviews and ratings',
                '24/7 customer support'
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-2xl"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-6">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'John Doe', role: 'Founder & CEO' },
              { name: 'Jane Smith', role: 'Head of Operations' },
              { name: 'Alex Johnson', role: 'Customer Support' }
            ].map((member, index) => (
              <div key={index} className="bg-background p-6 rounded-lg shadow-sm">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-4 mx-auto">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-lg font-medium text-center text-foreground">{member.name}</h3>
                <p className="text-muted-foreground text-center">{member.role}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
