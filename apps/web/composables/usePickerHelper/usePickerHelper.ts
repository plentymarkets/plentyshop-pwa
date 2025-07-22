export const usePickerHelper = () => {
  const placeholderImg = 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png';

  const imageTypes = ['wideScreen', 'desktop', 'tablet', 'mobile'] as const;

  const labels = {
    wideScreen: 'Image XL (Desktop)',
    desktop: 'Image L (Desktop)',
    tablet: 'Image M (Tablet)',
    mobile: 'Image S (Mobile)',
  };

  const imageDimensions = {
    wideScreen: '1920 × 1080',
    desktop: '1024 x 576',
    tablet: '768 x 432',
    mobile: ' 320 x 320',
  };

  const deleteImage = (imageObj: Record<string, unknown>, type: (typeof imageTypes)[number]) => {
    imageObj[type] = placeholderImg;
  };

  const isUploaderOpen = ref(false);

  const openUploader = () => {
    isUploaderOpen.value = true;
  };

  const closeUploader = () => {
    isUploaderOpen.value = false;
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
  };
};
