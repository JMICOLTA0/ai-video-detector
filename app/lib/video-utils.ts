
export const SUPPORTED_FORMATS = ['mp4', 'avi', 'mov', 'webm'];
export const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB in bytes

export function validateVideoFile(file: File): { isValid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds 300MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(1)}MB`
    };
  }

  // Check file format
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  if (!fileExtension || !SUPPORTED_FORMATS.includes(fileExtension)) {
    return {
      isValid: false,
      error: `Unsupported format. Please use: ${SUPPORTED_FORMATS.join(', ').toUpperCase()}`
    };
  }

  return { isValid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateVideoId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function validateVideoURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    return SUPPORTED_FORMATS.some(format => pathname.endsWith(`.${format}`));
  } catch {
    return false;
  }
}
