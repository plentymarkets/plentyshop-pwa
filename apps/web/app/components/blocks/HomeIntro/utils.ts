import type { HomeIntroContent } from './types';
import { DEFAULT_HOME_INTRO_TITLE, getDefaultHomeIntroContent } from './defaults';

/** Merge legacy subtitle into title and drop removed fields. */
export const normalizeHomeIntroContent = (raw: HomeIntroContent): HomeIntroContent => {
  const defaults = getDefaultHomeIntroContent();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const legacy = raw as HomeIntroContent & { subtitle?: string; aboutHeading?: string };

  let title: string = legacy.title?.trim() || defaults.title || DEFAULT_HOME_INTRO_TITLE;
  const subtitle = legacy.subtitle?.trim();

  if (subtitle && !title.includes(subtitle)) {
    title = `${title.replace(/\s+$/, '')} ${subtitle}`.trim();
  }

  return {
    title,
    lead: legacy.lead?.trim() || defaults.lead,
  };
};
