'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addAsset, setLoading, setError } from '../store/slices/assetsSlice';

export default function UploadSection() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadResult(null);
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setUploadResult(result);

      // Add to Redux store
      dispatch(addAsset({
        id: result.hash,
        filename: result.filename,
        size: result.size,
        type: result.type,
        hash: result.hash,
        uploadedAt: result.uploadedAt,
      }));

    } catch (error) {
      console.error('Upload error:', error);
      dispatch(setError('Failed to upload file'));
      setUploadResult({ error: 'Upload failed' });
    } finally {
      setUploading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
            <Upload className="text-purple-400" />
            Upload Media Asset
          </h2>

          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? 'border-purple-400 bg-purple-500/10'
                : 'border-gray-600 hover:border-purple-400 hover:bg-purple-500/5'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="flex flex-col items-center gap-4">
              {uploading ? (
                <Loader className="animate-spin text-purple-400" size={48} />
              ) : (
                <Upload size={48} className="text-gray-400" />
              )}

              <div>
                <p className="text-lg font-medium text-white mb-2">
                  {uploading ? 'Uploading...' : 'Drop your file here or click to browse'}
                </p>
                <p className="text-sm text-gray-400">
                  Supports images and videos up to 100MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Result */}
        <div className="glass p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
            <File className="text-cyan-400" />
            Upload Details
          </h2>

          {uploadResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {uploadResult.error ? (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="text-red-400" size={24} />
                  <div>
                    <p className="text-red-400 font-medium">Upload Failed</p>
                    <p className="text-red-300 text-sm">{uploadResult.error}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle className="text-green-400" size={24} />
                    <p className="text-green-400 font-medium">Upload Successful!</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Filename:</span>
                      <span className="text-white font-mono text-sm">{uploadResult.filename}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Size:</span>
                      <span className="text-white">{(uploadResult.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white">{uploadResult.type}</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">SHA-256 Hash:</span>
                      </div>
                      <p className="text-purple-400 font-mono text-xs break-all">{uploadResult.hash}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <File size={48} className="mx-auto mb-4 opacity-50" />
              <p>Upload a file to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}