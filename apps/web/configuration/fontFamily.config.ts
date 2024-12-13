export const fontFamilyText = process.env.TEXT || 'Red Hat Text';

export const fontFamilyNuxtConfig = {
  families: {
    [fontFamilyText]: { wght: [300, 400, 500, 700] },
  },
};
