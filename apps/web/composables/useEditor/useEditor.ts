export const useEditor = () => useState('isEditing', () => false);

const { formattedHeroItems, mediaData, recommendedProductsCategoryId } = await useHomepageData();
