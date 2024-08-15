export const fontFamilyDisplay = process.env.DISPLAY || 'Red Hat Display';
export const fontFamilyText = process.env.TEXT || 'Red Hat Text';

export const fontFamilyNuxtConfig = {
  families: {
    fontFamilyDisplay: { wght: [400, 500, 700] },
    fontFamilyText: { wght: [300, 400, 500, 700] },
  },
};
