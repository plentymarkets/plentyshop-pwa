import type { Review, ReviewItem, UpdateReviewParams, CreateReviewParams } from '@plentymarkets/shop-api';

export interface UseProductReviewsState {
  data: Review;
  authenticatedData: Review;
  loading: boolean;
  review?: ReviewItem | null;
  reviewArea: HTMLElement | null;
  isReviewModalOpen: boolean;
  modalType: string;
}

export type FetchProductReviews = (itemId: number, variationId?: number) => Promise<Review>;
export type FetchProductAuthenticatedReviews = (itemId: number, variationId: number) => Promise<Review>;
export type DeleteProductReview = (feedbackId: number) => Promise<void>;
export type SetProductReview = (params: UpdateReviewParams) => void;
export type CreateProductReview = (params: CreateReviewParams) => void;
export type FetchReviews = () => Promise<void>;
export type FetchAuthenticatedReviews = () => Promise<void>;
export type OpenReviewModal = (modalType: string, review?: ReviewItem) => void;
export type CloseReviewModal = () => void;

export interface UseProductReviewsReturn {
  data: Readonly<Ref<UseProductReviewsState['data']>>;
  authenticatedData: Readonly<Ref<UseProductReviewsState['authenticatedData']>>;
  review?: Readonly<Ref<UseProductReviewsState['review']>>;
  loading: Readonly<Ref<boolean>>;
  fetchProductReviews: FetchProductReviews;
  fetchProductAuthenticatedReviews: FetchProductAuthenticatedReviews;
  deleteProductReview: DeleteProductReview;
  createProductReview: CreateProductReview;
  setProductReview: SetProductReview;
  fetchReviews: FetchReviews;
  fetchAuthenticatedReviews: FetchAuthenticatedReviews;
  reviewArea: Readonly<Ref<UseProductReviewsState['reviewArea']>>;
  isReviewModalOpen: Readonly<Ref<UseProductReviewsState['isReviewModalOpen']>>;
  modalType: Readonly<Ref<UseProductReviewsState['modalType']>>;
  openReviewModal: OpenReviewModal;
  closeReviewModal: CloseReviewModal;
}

export type UseProductReviews = (itemId: number, productVariationId?: number) => UseProductReviewsReturn;
