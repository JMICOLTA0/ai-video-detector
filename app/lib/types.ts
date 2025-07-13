
export interface VideoAnalysisResult {
  isAIGenerated: boolean;
  confidence: number;
  processingTime: number;
  videoDetails: {
    duration: number;
    format: string;
    size: number;
  };
}

export interface VideoFile {
  file: File;
  preview: string;
  id: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  stage: string;
}

export interface APIResponse {
  success: boolean;
  result?: VideoAnalysisResult;
  error?: string;
}
