'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Flag, ExternalLink, Clock, Shield, Zap } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface Alert {
  id: string;
  hash: string;
  filename: string;
  platform: string;
  url: string;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
  description: string;
}

export default function MisuseDetection() {
  const { assets, trackingResults } = useSelector((state: RootState) => state.assets);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Generate mock alerts from tracking results
    const mockAlerts: Alert[] = [];

    Object.values(trackingResults).forEach((result) => {
      const asset = assets.find(a => a.hash === result.hash);
      if (!asset) return;

      result.detections
        .filter(d => d.status === 'Unauthorized')
        .forEach((detection, index) => {
          mockAlerts.push({
            id: `${result.hash}-${index}`,
            hash: result.hash,
            filename: asset.filename,
            platform: detection.platform,
            url: detection.url,
            severity: detection.confidence > 90 ? 'High' : detection.confidence > 70 ? 'Medium' : 'Low',
            timestamp: detection.timestamp,
            description: `Unauthorized usage detected on ${detection.platform} with ${detection.confidence}% confidence`
          });
        });
    });

    // Sort by timestamp (newest first)
    mockAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setAlerts(mockAlerts);
  }, [assets, trackingResults]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const handleReport = (alertId: string) => {
    // Mock report action
    console.log('Reporting alert:', alertId);
    // In a real app, this would send a report to authorities or platform
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="glass p-6 rounded-2xl text-center">
          <AlertTriangle className="text-red-400 mx-auto mb-2" size={32} />
          <div className="text-2xl font-bold text-white mb-1">{alerts.length}</div>
          <div className="text-gray-400 text-sm">Total Alerts</div>
        </div>
        <div className="glass p-6 rounded-2xl text-center">
          <Zap className="text-red-400 mx-auto mb-2" size={32} />
          <div className="text-2xl font-bold text-white mb-1">
            {alerts.filter(a => a.severity === 'High').length}
          </div>
          <div className="text-gray-400 text-sm">High Priority</div>
        </div>
        <div className="glass p-6 rounded-2xl text-center">
          <Shield className="text-yellow-400 mx-auto mb-2" size={32} />
          <div className="text-2xl font-bold text-white mb-1">
            {alerts.filter(a => a.severity === 'Medium').length}
          </div>
          <div className="text-gray-400 text-sm">Medium Priority</div>
        </div>
        <div className="glass p-6 rounded-2xl text-center">
          <Flag className="text-green-400 mx-auto mb-2" size={32} />
          <div className="text-2xl font-bold text-white mb-1">
            {alerts.filter(a => a.severity === 'Low').length}
          </div>
          <div className="text-gray-400 text-sm">Low Priority</div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
          <AlertTriangle className="text-red-400" />
          Misuse Detection Alerts
        </h2>

        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <Shield size={48} className="mx-auto text-green-400 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Alerts Detected</h3>
            <p className="text-gray-400">Your assets are secure. Track some assets to see potential misuse alerts.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle size={20} className="text-current" />
                      <span className="font-semibold text-white">{alert.filename}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity} Risk
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3">{alert.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{alert.platform}</span>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <a
                      href={alert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                      title="View on platform"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <button
                      onClick={() => handleReport(alert.id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                      title="Report misuse"
                    >
                      Report
                    </button>
                  </div>
                </div>

                <div className="text-xs font-mono bg-black/20 p-2 rounded text-gray-400 break-all">
                  Hash: {alert.hash}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}