import type { Review, ReviewItem } from '@plentymarkets/shop-api';
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
  const fetchProductReviews: FetchProductReviews = async (itemId: number) => {
    state.value.loading = true;
    const { data, error } = await useAsyncData(() =>
      useSdk().plentysystems.getReview({
        itemId: itemId,
      }),
    );
    useHandleError(error.value);
    state.value.data = data?.value?.data ?? state.value.data;
    state.value.loading = false;
    return state.value.data;
  };

  const createProductReview: CreateProductReview = async () => {
    /* state.value.loading = true;
    const { data, error } = await useAsyncData(() =>
        useSdk().plentysystems.doReview({

        }),
    );
    useHandleError(error.value);
    state.value.createdReview = data.value?.data ?? state.value.createdReview;
    state.value.loading = false;

    await fetchProductReviews(); */
  };

  const deleteProductReview: DeleteProductReview = async (feedbackId: number) => {
    state.value.loading = true;
    await useSdk().plentysystems.deleteReview({
      feedbackId: feedbackId,
    });
    await fetchProductReviews(itemId);
  };

  const setProductReview: SetProductReview = async (data: ReviewItem) => {
    state.value.loading = true;
    await useSdk().plentysystems.setReview({
      feedbackId: data.id || 0,
      message: data.feedbackComment.comment.message,
      title: data.title || '',
      ratingValue: Number(data.feedbackRating.rating),
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
