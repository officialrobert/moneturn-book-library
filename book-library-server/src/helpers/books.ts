import { isDevelopment, PORT, SERVER_BASE_URL } from '@/environment';
import { startsWith, trim } from 'lodash';

export function formatBookImagePreviewProperty(imagePreview: string) {
  imagePreview = trim(imagePreview);

  if (!imagePreview) {
    return '';
  }

  if (startsWith(imagePreview, 'http')) {
    return imagePreview;
  } else if (startsWith(imagePreview, '/')) {
    if (isDevelopment) {
      return `http://localhost:${PORT}/assets/images${imagePreview}`;
    } else {
      return `${SERVER_BASE_URL}/assets/images${imagePreview}`;
    }
  }

  return imagePreview;
}
