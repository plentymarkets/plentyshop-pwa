import type { CreateReviewParams, Review, UpdateReviewParams, ReviewItem, ApiError } from '@plentymarkets/shop-api';
import type {
  FetchProductReviews,
  UseProductReviews,
  UseProductReviewsState,
  DeleteProductReview,
  SetProductReview,
  CreateProductReview,
} from './types';
import { reviewGetters } from '@plentymarkets/shop-api';

/**
 * @description Composable managing product reviews data
 * @param variationId
 * @param itemId
 * @returns UseProductReviews
 * @example
 * ``` ts
 * const { data, loading, fetchProductReviews } = useProductReviews(1, 1);
 * ```
 */
export const useProductReviews: UseProductReviews = (itemId: number, productVariationId?: number) => {
  const state = useState<UseProductReviewsState>('useProductReviews', () => ({
    data: {} as Review,
    loading: false,
    review: {} as ReviewItem,
    reviewArea: null,
    isReviewModalOpen: false,
    modalType: '',
  }));

  const closeReviewModal = () => {
    state.value.isReviewModalOpen = false;
  };

  /** Function for fetching product reviews data
   * @return FetchProductReviews
   * @example
   * ``` ts
   * fetchProductReviews(1, 1);
   * ```
   */
  const fetchProductReviews: FetchProductReviews = async (itemId: number) => {
    const route = useRoute();
    const config = useRuntimeConfig().public;

    try {
      state.value.loading = true;
      const { data } = await useSdk().plentysystems.getReview({
        itemId: itemId,
        feedbacksPerPage: config.defaultItemsPerPage,
        page: Number(route.query.feedbackPage) || 1,
      });
      state.value.data.feedbacks = data?.feedbacks ?? state.value.data.feedbacks;
      state.value.data.pagination = data?.pagination ?? state.value.data.pagination;
      state.value.data.counts = data?.counts ?? state.value.data.counts;
      return state.value.data;
    } catch (error: unknown) {
      useHandleError(error as ApiError);
    } finally {
      state.value.loading = false;
    }
    return state.value.data;
  };

  const fetchReviews = async () => {
    await fetchProductReviews(itemId, productVariationId);
  };

  const createProductReview: CreateProductReview = async (params: CreateReviewParams) => {
    state.value.loading = true;
    closeReviewModal();

    const { send } = useNotification();
    const { $i18n } = useNuxtApp();
    try {
      const { data } = await useSdk().plentysystems.doReview(params);
      if (data) {
        send({ type: 'positive', message: $i18n.t('review.notification.success') });
      }
    } catch (error: unknown) {
      useHandleError(error as ApiError);
    }

    await fetchReviews();

    state.value.loading = false;
  };

  const deleteProductReview: DeleteProductReview = async () => {
    state.value.loading = true;
    closeReviewModal();

    const feedbackId = Number(reviewGetters.getReviewId(state?.value?.review || ({} as ReviewItem)));

    try {
      await useSdk().plentysystems.deleteReview({ feedbackId });
    } catch (error: unknown) {
      useHandleError(error as ApiError);
    }

    await fetchReviews();

    state.value.loading = false;
  };

  const setProductReview: SetProductReview = async (params: UpdateReviewParams) => {
    state.value.loading = true;
    closeReviewModal();

    const { send } = useNotification();
    const { $i18n } = useNuxtApp();

    try {
      await useSdk().plentysystems.setReview(params);
      send({ type: 'positive', message: $i18n.t('review.notification.success') });
    } catch (error: unknown) {
      useHandleError(error as ApiError);
    }

    await fetchReviews();

    state.value.loading = false;
  };

  const openReviewModal = (modalType: string, review?: ReviewItem) => {
    state.value.review = review;
    state.value.modalType = modalType;
    state.value.isReviewModalOpen = true;
  };

  return {
    fetchProductReviews,
    deleteProductReview,
    setProductReview,
    createProductReview,
    fetchReviews,
    openReviewModal,
    closeReviewModal,
    ...toRefs(state.value),
  };
};
