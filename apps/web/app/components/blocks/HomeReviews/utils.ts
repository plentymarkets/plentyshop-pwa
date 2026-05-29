import type { HomeReviewItem } from './types';
import { DEFAULT_HOME_REVIEWS } from './defaults';

export type NormalizedReview = {
  id: string;
  name: string;
  initials: string;
  when: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  avatar: {
    bg: string;
    text: string;
  };
};

export const normalizeReview = (item: HomeReviewItem): NormalizedReview => {
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
    avatar: item.avatar ?? { bg: '#64748B', text: '#FFFFFF' },
  };
};

export const resolveReviews = (reviews?: HomeReviewItem[]): NormalizedReview[] => {
  const list = Array.isArray(reviews) && reviews.length > 0 ? reviews : DEFAULT_HOME_REVIEWS;
  return list.map(normalizeReview);
};
