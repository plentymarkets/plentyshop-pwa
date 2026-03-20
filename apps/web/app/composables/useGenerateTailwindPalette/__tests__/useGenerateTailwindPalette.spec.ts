import { describe, it, expect } from 'vitest';
import { useGenerateTailwindPalette } from '../useGenerateTailwindPalette';

describe('useGenerateTailwindPalette', () => {
  it('should generate a header palette from a primary global palette reference', () => {
    const baseColor = ref('rgb(var(--colors-2-primary-500))');
    const palette = useGenerateTailwindPalette('header', baseColor);

    expect(palette.value['--colors-2-header-50']).toBe('var(--colors-2-primary-50)');
    expect(palette.value['--colors-2-header-500']).toBe('var(--colors-2-primary-500)');
    expect(palette.value['--colors-2-header-950']).toBe('var(--colors-2-primary-950)');
  });

  it('should generate a header palette from a secondary global palette reference', () => {
    const baseColor = ref('rgb(var(--colors-2-secondary-500))');
    const palette = useGenerateTailwindPalette('header', baseColor);

    expect(palette.value['--colors-2-header-100']).toBe('var(--colors-2-secondary-100)');
    expect(palette.value['--colors-2-header-700']).toBe('var(--colors-2-secondary-700)');
  });

  it('should generate a palette from a hex color', () => {
    const baseColor = ref('#0c7992');
    const palette = useGenerateTailwindPalette('header', baseColor);

    expect(palette.value['--colors-2-header-50']).toBe('222 247 252');
    expect(palette.value['--colors-2-header-500']).toBe('12 121 146');
    expect(palette.value['--colors-2-header-900']).toBe('2 24 28');
  });

  it('should return an empty palette when base color is empty', () => {
    const baseColor = ref('');
    const palette = useGenerateTailwindPalette('header', baseColor);

    expect(palette.value).toEqual({});
  });

  it('should return an empty palette when base color is not a global palette or hex', () => {
    const baseColor = ref('transparent');
    const palette = useGenerateTailwindPalette('header', baseColor);

    expect(palette.value).toEqual({});
  });

  it('should react to base color changes', () => {
    const baseColor = ref('rgb(var(--colors-2-primary-500))');
    const computedColor = computed(() => baseColor.value);
    const palette = useGenerateTailwindPalette('header', computedColor);

    expect(palette.value['--colors-2-header-500']).toBe('var(--colors-2-primary-500)');

    baseColor.value = '#0c7992';

    expect(palette.value['--colors-2-header-500']).toBe('12 121 146');
  });
});
