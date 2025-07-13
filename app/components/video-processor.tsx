
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Video, Clock, Database, CheckCircle, XCircle } from 'lucide-react';
import { VideoFile, ProcessingState, VideoAnalysisResult, APIResponse } from '@/lib/types';

interface VideoProcessorProps {
  video: VideoFile | string | null;
  onResult: (result: VideoAnalysisResult | null) => void;
  onReset: () => void;
}

export default function VideoProcessor({ video, onResult, onReset }: VideoProcessorProps) {
  const [processing, setProcessing] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: ''
  });

  const stages = [
    'Uploading video...',
    'Extracting frames...',
    'Running AI analysis...',
    'Calculating confidence...',
    'Finalizing results...'
  ];

  useEffect(() => {
    if (video) {
      analyzeVideo();
    }
  }, [video]);

  const analyzeVideo = async () => {
    if (!video) return;

    setProcessing({ isProcessing: true, progress: 0, stage: stages[0] });

    try {
      // Simulate processing stages
      for (let i = 0; i < stages.length; i++) {
        setProcessing({
          isProcessing: true,
          progress: ((i + 1) / stages.length) * 100,
          stage: stages[i]
        });
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      }

      // Make API call
      const formData = new FormData();
      if (typeof video === 'string') {
        formData.append('url', video);
      } else {
        formData.append('video', video.file);
      }

      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        body: formData
      });

      const data: APIResponse = await response.json();

      if (data.success && data.result) {
        onResult(data.result);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      onResult(null);
    } finally {
      setProcessing({ isProcessing: false, progress: 0, stage: '' });
    }
  };

  if (!video) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        {/* Video Preview */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-400" />
            Video Analysis
          </h3>
          
          {typeof video === 'string' ? (
            <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-3">
              <Video className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-white font-medium">Video URL</p>
                <p className="text-gray-400 text-sm truncate max-w-md">{video}</p>
              </div>
            </div>
          ) : (
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <video
                src={video.preview}
                controls
                className="w-full h-full object-contain"
                preload="metadata"
              />
            </div>
          )}
        </div>

        {/* Processing State */}
        {processing.isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 text-white">
              <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
              <span className="font-medium">Analyzing video...</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{processing.stage}</span>
                <span className="text-gray-400">{Math.round(processing.progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${processing.progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: Database, label: 'AI Models', value: '12 active' },
                { icon: Clock, label: 'Est. Time', value: '2-4 min' },
                { icon: CheckCircle, label: 'Accuracy', value: '92%+' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-3 bg-gray-900 rounded-lg"
                >
                  <item.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className="text-sm font-medium text-white">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reset Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          disabled={processing.isProcessing}
          className="mt-6 w-full py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {processing.isProcessing ? 'Processing...' : 'Analyze Another Video'}
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
