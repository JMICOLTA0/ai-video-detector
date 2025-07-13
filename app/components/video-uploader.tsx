
'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Video, Link, X, AlertCircle } from 'lucide-react';
import { validateVideoFile, validateVideoURL, generateVideoId } from '@/lib/video-utils';
import { VideoFile } from '@/lib/types';

interface VideoUploaderProps {
  onVideoSelect: (video: VideoFile | string) => void;
  disabled?: boolean;
}

export default function VideoUploader({ onVideoSelect, disabled }: VideoUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      setError(null);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFileSelect(files[0]);
      }
    },
    [disabled, handleFileSelect]
  );

  const handleFileSelect = useCallback((file: File) => {
    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    const videoFile: VideoFile = {
      file,
      preview: URL.createObjectURL(file),
      id: generateVideoId()
    };

    onVideoSelect(videoFile);
  }, [onVideoSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleURLSubmit = () => {
    setError(null);
    if (!urlInput.trim()) {
      setError('Please enter a video URL');
      return;
    }

    const validation = validateVideoURL(urlInput);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid video URL');
      return;
    }

    onVideoSelect(urlInput);
    setUrlInput('');
  };

  return (
    <div className="space-y-8">
      {/* File Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <Video className="w-6 h-6 text-purple-400" />
          Upload Video File
        </h2>
        
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            dragActive
              ? 'border-purple-400 bg-purple-900/20'
              : 'border-gray-600 hover:border-purple-500'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".mp4,.avi,.mov,.webm"
            onChange={handleFileInput}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          
          <motion.div
            animate={{ scale: dragActive ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <div className={`p-4 rounded-full ${dragActive ? 'bg-purple-400' : 'bg-gray-700'} transition-colors`}>
              <Upload className={`w-8 h-8 ${dragActive ? 'text-white' : 'text-gray-300'}`} />
            </div>
            
            <div>
              <p className="text-lg font-medium text-white mb-2">
                {dragActive ? 'Drop your video here' : 'Drag & drop your video file'}
              </p>
              <p className="text-gray-400 mb-4">
                or <span className="text-purple-400 font-medium">browse files</span>
              </p>
              <p className="text-sm text-gray-500">
                Supports MP4, AVI, MOV, WebM • Max 300MB
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* URL Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <Link className="w-6 h-6 text-purple-400" />
          Or Enter Video URL
        </h2>
        
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/video.mp4"
              disabled={disabled}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 disabled:opacity-50"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleURLSubmit}
            disabled={disabled || !urlInput.trim()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Analyze
          </motion.button>
        </div>
      </motion.div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-900/50 border border-red-500 rounded-lg p-4 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
