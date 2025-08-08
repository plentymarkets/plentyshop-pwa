import { ref } from 'vue';
import type { PickerHelperTemplate, UsePickerHelperReturn, ImageType } from './types';

export const usePickerHelper: UsePickerHelperReturn = () => {
  const placeholderImg = 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png';

  const imageTypes = ['wideScreen', 'desktop', 'tablet', 'mobile'] as const;

  const labels: Record<ImageType, string> = {
    wideScreen: 'Image XL (Desktop)',
    desktop: 'Image L (Desktop)',
    tablet: 'Image M (Tablet)',
    mobile: 'Image S (Mobile)',
  };

  const imageDimensions: Record<ImageType, string> = {
    wideScreen: '1920 × 1080',
    desktop: '1024 x 576',
    tablet: '768 x 432',
    mobile: '320 x 320',
  };

  const deleteImage: PickerHelperTemplate['deleteImage'] = (imageObj, type) => {
    imageObj[type] = placeholderImg;
  };

  const selectedImageType = ref<ImageType>('wideScreen');
  const customLabel = ref('');
  const isUploaderOpen = ref(false);

  const openUploader: PickerHelperTemplate['openUploader'] = (type, label) => {
    if (type && imageTypes.includes(type as ImageType)) selectedImageType.value = type as ImageType;
    customLabel.value = label ?? '';
    isUploaderOpen.value = true;
  };

  const closeUploader: PickerHelperTemplate['closeUploader'] = () => {
    isUploaderOpen.value = false;
    customLabel.value = '';
  };

  const getImageTypeLabel: PickerHelperTemplate['getImageTypeLabel'] = (imageType, customLabel = '') => {
    if (customLabel) return customLabel;
    switch (imageType) {
      case 'xl':
      case 'wideScreen':
        return 'XL (Desktop)';
      case 'desktop':
        return 'L (Desktop)';
      case 'tablet':
        return 'M (Tablet)';
      case 'mobile':
        return 'S (Mobile)';
      default:
        return imageType;
    }
  };

  return {
    placeholderImg,
    labels,
    imageDimensions,
    imageTypes,
    deleteImage,
    isUploaderOpen,
    openUploader,
    closeUploader,
    selectedImageType,
    customLabel,
    getImageTypeLabel,
  };
};
