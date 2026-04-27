'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Search,
  AlertTriangle,
  BarChart3,
  Shield,
  Menu,
  X,
  Home
} from 'lucide-react';
import Link from 'next/link';
import UploadSection from '../../components/UploadSection';
import AssetTracker from '../../components/AssetTracker';
import MisuseDetection from '../../components/MisuseDetection';
import AnalyticsDashboard from '../../components/AnalyticsDashboard';
import VerifyAuthenticity from '../../components/VerifyAuthenticity';

type TabType = 'upload' | 'tracker' | 'detection' | 'analytics' | 'verify';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'upload' as TabType, label: 'Upload Media', icon: Upload },
    { id: 'tracker' as TabType, label: 'Asset Tracker', icon: Search },
    { id: 'detection' as TabType, label: 'Misuse Detection', icon: AlertTriangle },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
    { id: 'verify' as TabType, label: 'Verify Authenticity', icon: Shield },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return <UploadSection />;
      case 'tracker':
        return <AssetTracker />;
      case 'detection':
        return <MisuseDetection />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'verify':
        return <VerifyAuthenticity />;
      default:
        return <UploadSection />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-50 w-64 glass backdrop-blur-xl transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:inset-0 transition-transform duration-300 ease-in-out`}
        initial={{ x: -256 }}
        animate={{ x: sidebarOpen ? 0 : -256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-3">
              <Shield className="text-purple-400" size={32} />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                MediaSentinel
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-6 border-t border-white/10">
            <Link href="/" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
              <Home size={20} />
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-0">
        <header className="glass backdrop-blur-xl border-b border-white/10 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h1>
              <p className="text-gray-400 mt-1">
                Manage and protect your digital sports assets
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}