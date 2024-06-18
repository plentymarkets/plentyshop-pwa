describe('tailwind helper', () => {
  it('should convert oklch to rgb', () => {
    const rgb = oklchToRgb('oklch(0.401 0.123 21.57)');
    
    expect(rgb).toEqual('125 36 41');
  });

  it('should return black if oklch is invalid', () => {
    const rgb = oklchToRgb('');

    expect(rgb).toEqual('0 0 0');
  });

  it('should get tailwind color palette in oklch format from hex', () => {
    const tailwindColors = getTailwindColorsOklch('#04bed6')

    expect(tailwindColors).toEqual([
      { weight: '50', value: 'oklch(0.62 0.107 210.719)'},
      { weight: '100', value: 'oklch(0.644 0.111 210.719)'},
      { weight: '200', value: 'oklch(0.667 0.115 210.719)'},
      { weight: '300', value: 'oklch(0.69 0.119 210.719)'},
      { weight: '400', value: 'oklch(0.713 0.123 210.719)'},
      { weight: '500', value: 'oklch(0.735 0.127 210.719)'},
      { weight: '600', value: 'oklch(0.756 0.117 210.719)'},
      { weight: '700', value: 'oklch(0.776 0.108 210.719)'},
      { weight: '800', value: 'oklch(0.795 0.098 210.719)'},
      { weight: '900', value: 'oklch(0.814 0.089 210.719)'},
      { weight: '950', value: 'oklch(0.832 0.08 210.719)'},
    ])
  })
})
