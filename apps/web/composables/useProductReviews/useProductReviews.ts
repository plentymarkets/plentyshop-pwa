import type { CreateReviewParams, Review, UpdateReviewParams } from '@plentymarkets/shop-api';
import type {
  FetchProductReviews,
  UseProductReviews,
  UseProductReviewsState,
  DeleteProductReview,
  SetProductReview,
  CreateProductReview,
} from './types';

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
export const useProductReviews: UseProductReviews = (itemId: number) => {
  const state = useState<UseProductReviewsState>(`useProductReviews-${itemId}`, () => ({
    data: {} as Review,
    loading: false,
    createdReview: {} as Review,
  }));

  /** Function for fetching product reviews data
   * @return FetchProductReviews
   * @example
   * ``` ts
   * fetchProductReviews(1, 1);
   * ```
   */
  const fetchProductReviews: FetchProductReviews = async (itemId: number, variationId?: number) => {
    state.value.loading = true;
    const { isAuthorized } = useCustomer();
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

  const createProductReview: CreateProductReview = async (params: CreateReviewParams) => {
    state.value.loading = true;
    const { send } = useNotification();
    const { $i18n } = useNuxtApp();
    const { data, error } = await useAsyncData(() => useSdk().plentysystems.doReview(params));
    useHandleError(error.value);
    if (data.value?.data && typeof data.value.data === 'string') {
      useHandleError({ message: data.value.data, statusCode: 500 });
    } else {
      state.value.createdReview = data.value?.data ?? state.value.createdReview;
      send({ type: 'positive', message: $i18n.t('review.notification.success') });
    }
    state.value.loading = false;
  };

  const deleteProductReview: DeleteProductReview = async (feedbackId: number) => {
    state.value.loading = true;

    await useSdk()
      .plentysystems.deleteReview({
        feedbackId: feedbackId,
      })
      .then(() => (state.value.loading = false));
  };

  const setProductReview: SetProductReview = async (params: UpdateReviewParams) => {
    state.value.loading = true;
    await useSdk().plentysystems.setReview(params);
    state.value.loading = false;
  };

  return {
    fetchProductReviews,
    deleteProductReview,
    setProductReview,
    createProductReview,
    ...toRefs(state.value),
  };
};
