
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Clock, FileVideo, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { VideoAnalysisResult } from '@/lib/types';
import { formatFileSize } from '@/lib/video-utils';

interface ResultsDisplayProps {
  result: VideoAnalysisResult | null;
  error?: string;
}

export default function ResultsDisplay({ result, error }: ResultsDisplayProps) {
  if (error) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-red-900/50 border border-red-500 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-6 h-6 text-red-400" />
            <h3 className="text-xl font-semibold text-red-300">Analysis Failed</h3>
          </div>
          <p className="text-red-200">{error}</p>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!result) return null;

  const confidenceColor = result.confidence >= 80 
    ? 'text-green-400' 
    : result.confidence >= 60 
    ? 'text-yellow-400' 
    : 'text-red-400';

  const resultColor = result.isAIGenerated ? 'text-red-400' : 'text-green-400';
  const bgColor = result.isAIGenerated 
    ? 'bg-red-900/20 border-red-500/50' 
    : 'bg-green-900/20 border-green-500/50';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-6"
      >
        {/* Main Result */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`rounded-xl p-6 border ${bgColor}`}
        >
          <div className="flex items-center gap-4 mb-4">
            {result.isAIGenerated ? (
              <AlertTriangle className="w-8 h-8 text-red-400" />
            ) : (
              <Shield className="w-8 h-8 text-green-400" />
            )}
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                Analysis Complete
              </h3>
              <p className={`text-xl font-semibold ${resultColor}`}>
                {result.isAIGenerated ? 'AI Generated' : 'Likely Human-made'}
              </p>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300 font-medium">Confidence Level</span>
              <span className={`text-lg font-bold ${confidenceColor}`}>
                {result.confidence}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <motion.div
                className={`h-3 rounded-full ${
                  result.confidence >= 80 
                    ? 'bg-gradient-to-r from-green-500 to-green-400' 
                    : result.confidence >= 60 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' 
                    : 'bg-gradient-to-r from-red-500 to-red-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Interpretation */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Interpretation
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {result.isAIGenerated 
                ? `This video shows strong indicators of AI generation with ${result.confidence}% confidence. The analysis detected patterns typical of synthetic media.`
                : `This video appears to be authentic human-made content with ${result.confidence}% confidence. No significant AI generation indicators were found.`
              }
            </p>
          </div>
        </motion.div>

        {/* Detailed Information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileVideo className="w-5 h-5 text-purple-400" />
            Analysis Details
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-900 rounded-lg">
              <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400 mb-1">Processing Time</p>
              <p className="text-sm font-medium text-white">
                {(result.processingTime / 1000).toFixed(1)}s
              </p>
            </div>
            
            <div className="text-center p-3 bg-gray-900 rounded-lg">
              <FileVideo className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400 mb-1">Format</p>
              <p className="text-sm font-medium text-white">
                {result.videoDetails.format}
              </p>
            </div>
            
            <div className="text-center p-3 bg-gray-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400 mb-1">Duration</p>
              <p className="text-sm font-medium text-white">
                {Math.round(result.videoDetails.duration)}s
              </p>
            </div>
            
            <div className="text-center p-3 bg-gray-900 rounded-lg">
              <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400 mb-1">File Size</p>
              <p className="text-sm font-medium text-white">
                {result.videoDetails.size ? formatFileSize(result.videoDetails.size) : 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Confidence Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-white font-medium mb-1">About This Analysis</h5>
              <p className="text-gray-400 text-sm">
                This AI detection system analyzes video content using advanced machine learning models 
                trained on millions of samples. Results are based on technical artifacts, temporal 
                inconsistencies, and visual patterns typical of AI-generated content.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
