'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, XCircle, Search, Upload, Hash } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function VerifyAuthenticity() {
  const [inputHash, setInputHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { assets } = useSelector((state: RootState) => state.assets);

  const handleVerify = async () => {
    if (!inputHash.trim()) return;

    setLoading(true);
    setVerificationResult(null);

    try {
      const response = await fetch('http://localhost:3001/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hash: inputHash.trim() }),
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const result = await response.json();
      setVerificationResult(result);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({ hash: inputHash, verified: false, error: 'Verification failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setVerificationResult(null);

    try {
      // Calculate hash client-side
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setInputHash(hash);
      // Auto-verify
      const response = await fetch('http://localhost:3001/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hash }),
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const result = await response.json();
      setVerificationResult(result);
    } catch (error) {
      console.error('File verification error:', error);
      setVerificationResult({ hash: '', verified: false, error: 'File verification failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass p-8 rounded-2xl mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
          <Shield className="text-green-400" />
          Verify Asset Authenticity
        </h2>

        <div className="space-y-6">
          {/* File Upload Option */}
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 hover:border-purple-400 transition-colors">
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="text-center">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-white font-medium mb-1">Upload file to verify</p>
                <p className="text-gray-400 text-sm">Automatically calculates hash and checks authenticity</p>
              </div>
            </label>
          </div>

          {/* Manual Hash Input */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Or enter SHA-256 hash manually
              </label>
              <input
                type="text"
                value={inputHash}
                onChange={(e) => setInputHash(e.target.value)}
                placeholder="e.g., a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
                className="w-full glass px-4 py-3 rounded-lg text-white bg-transparent border border-white/20 focus:border-purple-400 focus:outline-none font-mono text-sm"
              />
            </div>
            <button
              onClick={handleVerify}
              disabled={!inputHash.trim() || loading}
              className="glass px-6 py-3 rounded-lg text-white font-medium hover:neon-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mt-8"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Search size={20} />
              )}
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 rounded-2xl"
        >
          <h3 className="text-xl font-semibold mb-6 text-white">Verification Result</h3>

          <div className={`p-6 rounded-lg border ${
            verificationResult.verified
              ? 'bg-green-500/10 border-green-500/20'
              : 'bg-red-500/10 border-red-500/20'
          }`}>
            <div className="flex items-center gap-4 mb-4">
              {verificationResult.verified ? (
                <CheckCircle size={32} className="text-green-400" />
              ) : (
                <XCircle size={32} className="text-red-400" />
              )}
              <div>
                <h4 className="text-lg font-semibold text-white">
                  {verificationResult.verified ? 'Authentic Asset' : 'Asset Not Found'}
                </h4>
                <p className="text-gray-300">
                  {verificationResult.verified
                    ? 'This asset is registered in our database and verified as authentic.'
                    : 'This hash does not match any registered assets in our database.'
                  }
                </p>
              </div>
            </div>

            {verificationResult.verified && verificationResult.details && (
              <div className="space-y-3 mt-6 pt-6 border-t border-white/10">
                <h5 className="font-medium text-white mb-3">Asset Details:</h5>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-400">Filename</div>
                    <div className="text-white font-medium">{verificationResult.details.filename}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-400">File Size</div>
                    <div className="text-white font-medium">
                      {(verificationResult.details.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-400">File Type</div>
                    <div className="text-white font-medium">{verificationResult.details.type}</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-sm text-gray-400">Upload Date</div>
                    <div className="text-white font-medium">
                      {new Date(verificationResult.details.uploadedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">SHA-256 Hash</div>
                  <div className="text-purple-400 font-mono text-sm break-all">
                    {verificationResult.details.hash}
                  </div>
                </div>
              </div>
            )}

            {verificationResult.error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{verificationResult.error}</p>
              </div>
            )}
          </div>

          {/* Blockchain-style verification badge */}
          {verificationResult.verified && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full border-2 border-green-500/30">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-semibold">✓ Verified on MediaSentinel</span>
                <Shield size={16} className="text-green-400" />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Recent Assets */}
      {assets.length > 0 && (
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-3">
            <Hash className="text-purple-400" />
            Recent Assets ({assets.length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {assets.slice(-5).reverse().map((asset) => (
              <button
                key={asset.id}
                onClick={() => setInputHash(asset.hash)}
                className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-medium text-sm">{asset.filename}</div>
                    <div className="text-gray-400 text-xs">
                      {new Date(asset.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-purple-400 font-mono text-xs">
                    {asset.hash.slice(0, 16)}...
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}