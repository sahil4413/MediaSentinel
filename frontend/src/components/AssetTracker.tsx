'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ExternalLink, Clock, AlertTriangle, CheckCircle, Loader } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setTrackingResult, setLoading, setError } from '../store/slices/assetsSlice';
import { Detection } from '../store/slices/assetsSlice';

export default function AssetTracker() {
  const [selectedHash, setSelectedHash] = useState<string>('');
  const { assets, trackingResults, loading } = useSelector((state: RootState) => state.assets);
  const dispatch = useDispatch();

  const handleTrack = async (hash: string) => {
    if (!hash) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await fetch(`http://localhost:3001/track/${hash}`);
      if (!response.ok) {
        throw new Error('Tracking failed');
      }

      const result = await response.json();
      dispatch(setTrackingResult(result));
    } catch (error) {
      console.error('Tracking error:', error);
      dispatch(setError('Failed to track asset'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const currentResult = selectedHash ? trackingResults[selectedHash] : null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Asset Selection */}
      <div className="glass p-6 rounded-2xl mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
          <Search className="text-cyan-400" />
          Select Asset to Track
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={selectedHash}
            onChange={(e) => setSelectedHash(e.target.value)}
            className="glass px-4 py-3 rounded-lg text-white bg-transparent border border-white/20 focus:border-purple-400 focus:outline-none"
          >
            <option value="">Choose an asset...</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.hash} className="bg-gray-800">
                {asset.filename} - {asset.hash.slice(0, 16)}...
              </option>
            ))}
          </select>

          <button
            onClick={() => handleTrack(selectedHash)}
            disabled={!selectedHash || loading}
            className="glass px-6 py-3 rounded-lg text-white font-medium hover:neon-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Search size={20} />
            )}
            {loading ? 'Tracking...' : 'Track Asset'}
          </button>
        </div>
      </div>

      {/* Tracking Results */}
      {currentResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {currentResult.totalDetections}
              </div>
              <div className="text-gray-300">Total Detections</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {currentResult.unauthorizedCount}
              </div>
              <div className="text-gray-300">Unauthorized</div>
            </div>
            <div className="glass p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {currentResult.totalDetections - currentResult.unauthorizedCount}
              </div>
              <div className="text-gray-300">Authorized</div>
            </div>
          </div>

          {/* Detections List */}
          <div className="glass p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-6 text-white">Detection Results</h3>
            <div className="space-y-4">
              {currentResult.detections.map((detection: Detection, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    detection.status === 'Unauthorized'
                      ? 'bg-red-500/10 border-red-500/20'
                      : 'bg-green-500/10 border-green-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {detection.status === 'Unauthorized' ? (
                        <AlertTriangle className="text-red-400" size={20} />
                      ) : (
                        <CheckCircle className="text-green-400" size={20} />
                      )}
                      <span className="font-medium text-white">{detection.platform}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        detection.status === 'Unauthorized'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {detection.status}
                      </span>
                    </div>
                    <a
                      href={detection.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(detection.timestamp).toLocaleString()}
                      </div>
                      <div>Confidence: {detection.confidence}%</div>
                    </div>
                    <div className="text-xs font-mono bg-black/20 px-2 py-1 rounded">
                      {detection.url}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {!currentResult && !loading && (
        <div className="glass p-12 rounded-2xl text-center">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No Tracking Data</h3>
          <p className="text-gray-400">Select an asset and click "Track Asset" to see detection results</p>
        </div>
      )}
    </div>
  );
}