
import { NextRequest, NextResponse } from 'next/server';
import { VideoAnalysisResult } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    const url = formData.get('url') as string;

    if (!file && !url) {
      return NextResponse.json(
        { success: false, error: 'No video file or URL provided' },
        { status: 400 }
      );
    }

    // Simulate processing time (2-4 seconds)
    const processingTime = Math.random() * 2000 + 2000;
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Mock AI analysis result
    const confidence = Math.random() * 30 + 70; // 70-100% confidence
    const isAIGenerated = Math.random() > 0.6; // 40% chance of being AI-generated

    const result: VideoAnalysisResult = {
      isAIGenerated,
      confidence: parseFloat(confidence.toFixed(1)),
      processingTime: Math.round(processingTime),
      videoDetails: {
        duration: Math.random() * 120 + 10, // 10-130 seconds
        format: file?.name?.split('.').pop()?.toUpperCase() || 'MP4',
        size: file?.size || 0
      }
    };

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Video analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze video' },
      { status: 500 }
    );
  }
}
