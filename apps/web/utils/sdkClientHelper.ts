const VSL_LOCALE_COOKIE = 'vsf-locale';

export const updateVsfLocale = (cookie: string, locale: string): string => {
  let cookieExists = false;
  const cookies = (cookie ?? '').split(';');
  const cookiesArray = cookies.map((cookie) => {
    if (cookie.trim().includes(VSL_LOCALE_COOKIE)) {
      cookieExists = true;
      return `${VSL_LOCALE_COOKIE}=${locale}`;
    }
    return cookie;
  });

  if (!cookieExists) {
    cookiesArray.push(`${VSL_LOCALE_COOKIE}=${locale}`);
  }

  return cookiesArray.join('; ');
};
