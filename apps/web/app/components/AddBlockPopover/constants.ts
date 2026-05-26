import type { LayoutPreset } from './types';

export const LAYOUT_PRESETS: readonly LayoutPreset[] = [
  { id: '1-col', label: '1 Col', columnWidths: [12] },
  { id: '2-equal', label: '2 Equal', columnWidths: [6, 6] },
  { id: 'sidebar-l', label: 'Sidebar L', columnWidths: [3, 9] },
  { id: 'sidebar-r', label: 'Sidebar R', columnWidths: [9, 3] },
  { id: '3-equal', label: '3 Equal', columnWidths: [4, 4, 4] },
  { id: '4-equal', label: '4 Equal', columnWidths: [3, 3, 3, 3] },
];

export const DEPTH_FORBIDDEN_CATEGORY_BLOCKS = ['MultiGrid', 'BannerCarousel', 'ImageText'] as const;

export const SINGLETON_BLOCKS = ['SortFilter', 'ItemGrid', 'Navigation'] as const;
