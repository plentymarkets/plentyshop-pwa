import { CookieGroup, CookieGroupFromNuxtConfig } from 'cookie.config';

const convertToDays = (daysInString: string): number => {
  return Number.parseInt(daysInString.split(' ')[0]);
};

const getMinimumLifeSpan = (cookieJsonFromConfig: CookieGroupFromNuxtConfig): number => {
  // expected minimum lifetime span to be in days
  let minimum = 100_000;

  cookieJsonFromConfig.groups.forEach((group: CookieGroup) => {
    group.cookies.forEach((cookie) => {
      if (minimum > convertToDays(cookie.Lifespan)) {
        minimum = convertToDays(cookie.Lifespan);
      }
    });
  });

  return 60 * 60 * 24 * minimum;
};

export const cookieBarHelper = () => {
  return {
    getMinimumLifeSpan,
  };
};
