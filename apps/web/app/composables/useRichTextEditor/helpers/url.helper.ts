import isURL from 'validator/es/lib/isURL';

export const urlValidatorOptions = {
  protocols: ['http', 'https'],
  require_tld: false,
};

export const validateUrl = (url: string): boolean => {
  const value = url.trim();

  if (!isURL(value, urlValidatorOptions)) {
    return false;
  }

  try {
    const parsedUrl = new URL(value);

    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};
