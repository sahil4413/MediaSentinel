'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Eye, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
              MediaSentinel
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Protect Your Digital Sports Assets with AI-Powered Content Fingerprinting
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link href="/dashboard">
                <motion.button
                  className="glass neon-glow px-8 py-4 rounded-full text-lg font-semibold text-white flex items-center gap-2 hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={20} />
                  Launch Dashboard
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Powerful Protection Features
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Content Fingerprinting',
                description: 'Generate unique SHA-256 hashes for all your digital assets, ensuring tamper-proof identification.'
              },
              {
                icon: Eye,
                title: 'Real-time Monitoring',
                description: 'Track content propagation across social media platforms and detect unauthorized usage instantly.'
              },
              {
                icon: Zap,
                title: 'Instant Alerts',
                description: 'Receive immediate notifications when suspicious activity is detected on your protected assets.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass p-8 rounded-2xl text-center hover:neon-glow transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <feature.icon size={48} className="text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center glass p-12 rounded-3xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Ready to Secure Your Assets?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the future of digital asset protection. Start monitoring your sports media content today.
          </p>
          <Link href="/dashboard">
            <motion.button
              className="glass neon-glow px-12 py-6 rounded-full text-xl font-semibold text-white flex items-center gap-3 mx-auto hover:scale-105 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield size={24} />
              Get Started Now
              <ArrowRight size={24} />
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
