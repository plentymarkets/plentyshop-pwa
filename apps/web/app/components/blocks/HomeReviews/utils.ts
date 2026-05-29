import type { HomeReviewItem, HomeReviewSource } from './types';
import { DEFAULT_HOME_REVIEWS } from './defaults';

export type NormalizedReview = {
  id: string;
  name: string;
  initials: string;
  when: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  source: HomeReviewSource;
  avatar: {
    bg: string;
    text: string;
  };
};

export const GOOGLE_REVIEW_LOGO = '/_nuxt-plenty/images/google.png';
export const EBAY_REVIEW_LOGO = '/_nuxt-plenty/images/ebay.png';

export const reviewSourceMeta: Record<
  HomeReviewSource,
  { logo: string; label: string }
> = {
  google: { logo: GOOGLE_REVIEW_LOGO, label: 'Google Bewertung' },
  ebay: { logo: EBAY_REVIEW_LOGO, label: 'eBay Bewertung' },
};

const isSchammuramat = (review: HomeReviewItem) =>
  review.id === 'schammuramat' || review.name === 'schammuramat';

const isAndreSchneider = (review: HomeReviewItem) =>
  review.id === 'a-schneider' || review.name === 'André Schneider';

/** schammuramat at 3rd slot (eBay); André Schneider at 4th (Google). Updates CMS-backed lists too. */
export const applyHomeReviewsDisplayOrder = (reviews: HomeReviewItem[]): HomeReviewItem[] => {
  const targetIndex = 2;
  const schIndex = reviews.findIndex(isSchammuramat);

  let next = reviews.map((review) => {
    if (isSchammuramat(review)) return { ...review, source: 'ebay' as const };
    if (isAndreSchneider(review)) return { ...review, source: 'google' as const };
    return review;
  });

  if (schIndex === -1 || schIndex === targetIndex) {
    return next;
  }

  const reordered = [...next];
  const [schammuramat] = reordered.splice(schIndex, 1);
  if (!schammuramat) return next;

  reordered.splice(targetIndex, 0, { ...schammuramat, source: 'ebay' });

  return reordered;
};

export const resolveReviewSource = (item: HomeReviewItem, index: number): HomeReviewSource => {
  if (isSchammuramat(item)) return 'ebay';
  if (isAndreSchneider(item)) return 'google';
  return item.source ?? (index < 3 ? 'google' : 'ebay');
};

export const normalizeReview = (item: HomeReviewItem, index: number): NormalizedReview => {
  const name = item.name?.trim() || 'Anonymous';
  const initials = item.initials?.trim() || name.charAt(0).toUpperCase() || '?';
  const rating = Math.min(5, Math.max(1, item.rating ?? 5)) as 1 | 2 | 3 | 4 | 5;

  return {
    id: item.id,
    name,
    initials,
    when: item.when ?? '',
    rating,
    text: item.text ?? '',
    source: resolveReviewSource(item, index),
    avatar: item.avatar ?? { bg: '#64748B', text: '#FFFFFF' },
  };
};

export const resolveReviews = (reviews?: HomeReviewItem[]): NormalizedReview[] => {
  const list = Array.isArray(reviews) && reviews.length > 0 ? reviews : DEFAULT_HOME_REVIEWS;
  const ordered = applyHomeReviewsDisplayOrder(list);
  return ordered.map((item, index) => normalizeReview(item, index));
};
