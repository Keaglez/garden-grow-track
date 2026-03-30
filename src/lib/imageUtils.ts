/**
 * Compress and resize an image file to a base64 string suitable for Firebase storage.
 * Firebase Firestore documents have a 1MB limit, so we cap image size.
 */
export const compressImageToBase64 = (
  file: File,
  maxWidth = 600,
  maxHeight = 600,
  quality = 0.6
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Convert blob/file to a proper data URL first
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return reject(new Error('Failed to read file data'));

      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Scale down proportionally
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas context unavailable'));

          ctx.drawImage(img, 0, 0, width, height);

          // Output as JPEG base64 for smaller size
          const base64 = canvas.toDataURL('image/jpeg', quality);
          
          // Verify the output is valid
          if (!base64 || base64 === 'data:,') {
            return reject(new Error('Canvas produced empty image'));
          }
          
          resolve(base64);
        } catch (err) {
          reject(new Error('Image compression failed: ' + (err as Error).message));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};
