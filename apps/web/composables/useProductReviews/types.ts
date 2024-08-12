import type { Review, UpdateReviewParams, CreateReviewParams } from '@plentymarkets/shop-api';

export interface UseProductReviewsState {
  data: Review;
  loading: boolean;
  createdReview: Review;
  isReviewModalOpen: boolean;
}

export type FetchProductReviews = (itemId: number, variationId?: number) => Promise<Review>;
export type DeleteProductReview = (feedbackId: number) => Promise<void>;
export type SetProductReview = (params: UpdateReviewParams) => void;
export type CreateProductReview = (params: CreateReviewParams) => void;
export type FetchReviews = () => Promise<void>;
export type OpenReviewModal = () => void;
export type CloseReviewModal = () => void;

export interface UseProductReviewsReturn {
  data: Readonly<Ref<UseProductReviewsState['data']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductReviews: FetchProductReviews;
  deleteProductReview: DeleteProductReview;
  createProductReview: CreateProductReview;
  setProductReview: SetProductReview;
  fetchReviews: FetchReviews;
  isReviewModalOpen: Readonly<Ref<UseProductReviewsState['isReviewModalOpen']>>;
  openReviewModal: OpenReviewModal;
  closeReviewModal: CloseReviewModal;
}

export type UseProductReviews = (itemId: number, productVariationId?: number) => UseProductReviewsReturn;
