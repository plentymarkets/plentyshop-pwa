import type { QuickAddOption } from '~/components/editor/QuickAdd/types';

export const headerQuickAddOptions: QuickAddOption[] = [
  { blockName: 'UtilityBar', label: getBlockDisplayName('UtilityBar'), category: 'header', variationIndex: 0 },
  { blockName: 'Navigation', label: getBlockDisplayName('Navigation'), category: 'header', variationIndex: 1 },
  { blockName: 'AnnouncementBar', label: getBlockDisplayName('AnnouncementBar'), category: 'header', variationIndex: 2 },
];

export const footerQuickAddOptions: QuickAddOption[] = [
  { blockName: 'Image', label: getBlockDisplayName('Image'), category: 'image', variationIndex: 0 },
  { blockName: 'TextCard', label: getBlockDisplayName('TextCard'), category: 'text', variationIndex: 0 },
  { blockName: 'MultiGrid', label: getBlockDisplayName('MultiGrid'), category: 'layout', variationIndex: 0 },
];

export const multiGridQuickAddOptions: QuickAddOption[] = [
  { blockName: 'Image', label: getBlockDisplayName('Image'), category: 'image', variationIndex: 0 },
  { blockName: 'TextCard', label: getBlockDisplayName('TextCard'), category: 'text', variationIndex: 0 },
  { blockName: 'MultiGrid', label: getBlockDisplayName('MultiGrid'), category: 'layout', variationIndex: 0 },
];
