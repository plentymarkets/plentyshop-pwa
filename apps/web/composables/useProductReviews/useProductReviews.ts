import type { CreateReviewParams, Review, UpdateReviewParams, ReviewItem } from '@plentymarkets/shop-api';
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
  const fetchProductReviews: FetchProductReviews = async (itemId: number, variationId?: number) => {
    state.value.loading = true;
    const route = useRoute();
    try {
      const { data, error } = await useAsyncData(() =>
        useSdk().plentysystems.getReview({
          itemId: itemId,
          page: Number(route.query.feedbackPage) || 1,
        }),
      );
      useHandleError(error.value);
      state.value.data.feedbacks = data?.value?.data?.feedbacks ?? state.value.data.feedbacks;
      state.value.data.pagination = data?.value?.data?.pagination ?? state.value.data.pagination;
      state.value.loading = false;
      return state.value.data;
    } catch (error: unknown) {
      useHandleError({
        statusCode: 500,
        message: String(error),
      });
    }
    return state.value.data;
  };

  const fetchReviews = async () => {
    const { fetchProductReviewAverage } = useProductReviewAverage(itemId);

    await Promise.all([fetchProductReviews(itemId, productVariationId), fetchProductReviewAverage(itemId)]);
  };

  const createProductReview: CreateProductReview = async (params: CreateReviewParams) => {
    state.value.loading = true;
    closeReviewModal();

    const { send } = useNotification();
    const { $i18n } = useNuxtApp();
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doReview(params));
    useHandleError(error.value);
    if (data.value?.data && typeof data.value.data === 'string') {
      useHandleError({ message: data.value.data, statusCode: 500 });
    } else {
      send({ type: 'positive', message: $i18n.t('review.notification.success') });
    }

    await fetchReviews();

    state.value.loading = false;
  };

  const deleteProductReview: DeleteProductReview = async () => {
    state.value.loading = true;
    closeReviewModal();

    const feedbackId = Number(reviewGetters.getReviewId(state?.value?.review || ({} as ReviewItem)));

    const { error } = await useAsyncData(() => useSdk().plentysystems.deleteReview({ feedbackId }));
    useHandleError(error.value);

    await fetchReviews();

    state.value.loading = false;
  };

  const setProductReview: SetProductReview = async (params: UpdateReviewParams) => {
    state.value.loading = true;
    closeReviewModal();

    const { send } = useNotification();
    const { $i18n } = useNuxtApp();

    const { error } = await useAsyncData(() => useSdk().plentysystems.setReview(params));
    useHandleError(error.value);

    if (!error.value) {
      send({ type: 'positive', message: $i18n.t('review.notification.success') });
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
