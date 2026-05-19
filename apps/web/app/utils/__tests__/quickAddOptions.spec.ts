import { describe, expect, it, vi } from 'vitest';

vi.mock('../blocks/get-block-display-name', () => ({
  getBlockDisplayName: (blockName: string) => blockName,
}));

const { getBlockDisplayName } = await import('../blocks/get-block-display-name');

vi.stubGlobal('getBlockDisplayName', getBlockDisplayName);

const { headerQuickAddOptions, footerQuickAddOptions, multiGridQuickAddOptions } = await import('../quick-add-options');

describe('headerQuickAddOptions', () => {
  it('should contain 3 options', () => {
    expect(headerQuickAddOptions).toHaveLength(3);
  });

  it('should have UtilityBar, Navigation, and AnnouncementBar blocks', () => {
    expect(headerQuickAddOptions.map((option) => option.blockName)).toEqual([
      'UtilityBar',
      'Navigation',
      'AnnouncementBar',
    ]);
  });

  it('should all have category "header"', () => {
    expect(headerQuickAddOptions.map((option) => option.category)).toEqual(['header', 'header', 'header']);
  });

  it('should have sequential variationIndex values', () => {
    expect(headerQuickAddOptions.map((option) => option.variationIndex)).toEqual([0, 1, 2]);
  });

  it('should use getBlockDisplayName for labels', () => {
    expect(headerQuickAddOptions.map((option) => option.label)).toEqual([
      'UtilityBar',
      'Navigation',
      'AnnouncementBar',
    ]);
  });
});

describe('footerQuickAddOptions', () => {
  it('should contain 2 options', () => {
    expect(footerQuickAddOptions).toHaveLength(2);
  });

  it('should have Image and TextCard blocks', () => {
    expect(footerQuickAddOptions.map((option) => option.blockName)).toEqual(['Image', 'TextCard']);
  });

  it('should have correct categories', () => {
    expect(footerQuickAddOptions.map((option) => option.category)).toEqual(['image', 'text']);
  });

  it('should all have variationIndex 0', () => {
    expect(footerQuickAddOptions.map((option) => option.variationIndex)).toEqual([0, 0]);
  });
});

describe('multiGridQuickAddOptions', () => {
  it('should contain 3 options', () => {
    expect(multiGridQuickAddOptions).toHaveLength(3);
  });

  it('should have Image, TextCard, and MultiGrid (Grid row) blocks', () => {
    expect(multiGridQuickAddOptions.map((option) => option.blockName)).toEqual(['Image', 'TextCard', 'MultiGrid']);
  });

  it('should have correct categories', () => {
    expect(multiGridQuickAddOptions.map((option) => option.category)).toEqual(['image', 'text', 'row']);
  });

  it('should all have variationIndex 0', () => {
    expect(multiGridQuickAddOptions.map((option) => option.variationIndex)).toEqual([0, 0, 0]);
  });

  it('should mark the Grid option as type row', () => {
    const gridOption = multiGridQuickAddOptions.find((o) => o.category === 'row');
    expect(gridOption?.type).toBe('row');
    expect(gridOption?.label).toBe('Grid');
  });
});
