import type { CreateReviewParams, Review, ReviewResponse, UpdateReviewParams } from '@plentymarkets/shop-api';
import { toRefs } from '@vueuse/shared';
import { useSdk } from '~/sdk';
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

    try {
      const feedbackCalls = [
        useSdk().plentysystems.getReview({
          itemId: itemId,
        }),
      ];

      if (variationId && isAuthorized.value) {
        feedbackCalls.push(
          useSdk().plentysystems.getAuthenticatedReview({
            itemId: itemId,
            variationId: variationId,
          }),
        );
      }

      await Promise.all(feedbackCalls).then((data: ReviewResponse[]) => {
        const feedbacks = [...(data[1]?.data?.feedbacks || []), ...data[0].data.feedbacks];
        state.value.data.feedbacks = feedbacks || state.value.data;
        return true;
      });

      state.value.loading = false;
      return state.value.data;
    } catch (error: any) {
      useHandleError({
        status: 500,
        statusText: error.toString(),
      });
    }
    return state.value.data;
  };

  const createProductReview: CreateProductReview = async (params: CreateReviewParams) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.doReview({
        title: params.title,
        authorName: params.authorName,
        ratingValue: params.ratingValue,
        message: params.message,
        type: params.type,
        targetId: params.targetId,
        honeypot: params.honeypot,
        titleMissing: params.titleMissing,
        ratingMissing: params.ratingMissing,
      }),
    );
    useHandleError(error.value);
    state.value.createdReview = data.value?.data ?? state.value.createdReview;
    state.value.loading = false;

    await fetchProductReviews(itemId);
  };

  const deleteProductReview: DeleteProductReview = async (feedbackId: number) => {
    state.value.loading = true;
    await useSdk().plentysystems.deleteReview({
      feedbackId: feedbackId,
    });
    await fetchProductReviews(itemId);
  };

  const setProductReview: SetProductReview = async (params: UpdateReviewParams) => {
    state.value.loading = true;
    await useSdk().plentysystems.setReview({
      feedbackId: Number(params.feedbackId) || 0,
      message: params.message.toString(),
      title: params.title?.toString() || '',
      ratingValue: Number(params.ratingValue) || 0,
    });
    await fetchProductReviews(itemId);
  };

  return {
    fetchProductReviews,
    deleteProductReview,
    setProductReview,
    createProductReview,
    ...toRefs(state.value),
  };
};
