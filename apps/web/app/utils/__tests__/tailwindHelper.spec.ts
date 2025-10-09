describe('tailwind helper', () => {
  it('should get RGB color palette from hex', () => {
    const hexColor = '#0c7992';
    const expectedPalette = [
      { weight: '50', rgb: '222 247 252' },
      { weight: '100', rgb: '189 238 250' },
      { weight: '200', rgb: '123 222 244' },
      { weight: '300', rgb: '62 207 239' },
      { weight: '400', rgb: '17 176 212' },
      { weight: '500', rgb: '12 121 146' },
      { weight: '600', rgb: '10 98 118' },
      { weight: '700', rgb: '7 74 90' },
      { weight: '800', rgb: '5 47 57' },
      { weight: '900', rgb: '2 24 28' },
    ];

    const palette = getPaletteFromColor('primary', hexColor);
    expect(palette).toEqual(expectedPalette);
  });
});
