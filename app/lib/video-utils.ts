
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

export function validateVideoURL(url: string): { isValid: boolean; error?: string } {
  try {
    const urlObj = new URL(url);

    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must start with http:// or https://' };
    }

    const path = urlObj.pathname.toLowerCase();
    const matches = path.match(/\.([a-z0-9]+)$/);
    const ext = matches?.[1];

    if (!ext || !SUPPORTED_FORMATS.includes(ext)) {
      return {
        isValid: false,
        error: `Unsupported format. Please use: ${SUPPORTED_FORMATS.join(', ').toUpperCase()}`
      };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
}
