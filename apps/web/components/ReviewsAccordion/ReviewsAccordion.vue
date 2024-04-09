<template>
  <div data-testid="reviews-accordion" id="customerReviewsAccordion">
    <UiAccordionItem
      v-if="totalReviews"
      summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center"
      v-model="reviewsOpen"
    >
      <template #summary>
        <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl" id="customerReviewsClick">
          {{ $t('customerReviews') }}
        </h2>
      </template>
      <div class="my-4">
        <template v-if="isAuthorized">
          <SfButton type="submit" data-testid="create-review" size="base" @click="open">
            {{ $t('createCustomerReview') }}
          </SfButton>
        </template>
        <template v-else>
          <SfLink
            class="text-primary-800 hover:underline hover:!text-neutral-900 active:underline active:!text-neutral-900"
            variant="secondary"
            href="#"
            @click="openLoginModal"
          >
            {{ $t(`loginBeforeCreateReview`) }}
          </SfLink>
        </template>
      </div>
      <SfLoaderCircular v-if="loading && productReviews.length === 0" size="sm" />
      <UiReview
        v-for="(reviewItem, key) in productReviews"
        :key="key"
        :review-item="reviewItem"
        @on-submit="saveReview"
      />
    </UiAccordionItem>
    <div v-else class="w-full mt-4 py-2 pl-4 pr-3 flex justify-between items-center">
      <p class="font-bold leading-6">{{ $t('customerReviewsNone') }}</p>
    </div>
    <UiDivider v-if="reviewsOpen && productReviews.length > 0" class="mb-2 mt-2" />
  </div>
  <!-- TODO Luisa: Fix classes in UiModal to fit content into modal background -->
  <UiModal
    v-model="isOpen"
    aria-labelledby="review-modal"
    tag="section"
    role="dialog"
    class="h-fit w-full md:w-[600px]"
  >
    <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
      <SfIconClose />
    </SfButton>
    <ReviewForm class="h-[520px]" @on-close="close" @on-submit="saveReview"></ReviewForm>
  </UiModal>
</template>
<script lang="ts" setup>
import { SfButton, SfIconClose, SfLink, SfLoaderCircular, useDisclosure } from '@storefront-ui/vue';
import { reviewGetters, productGetters } from '@plentymarkets/shop-sdk';
import type { ProductAccordionPropsType } from '~/components/ReviewsAccordion/types';
const props = defineProps<ProductAccordionPropsType>();
const { send } = useNotification();
const { isOpen, open, close } = useDisclosure();
const { isAuthorized } = useCustomer();
const { open: openLoginModal } = useLoginModal();
const { product, totalReviews } = toRefs(props);
const reviewsOpen = ref(false);

const {
  data: productReviewsData,
  fetchProductReviews,
  createProductReview,
  loading,
} = useProductReviews(Number(productGetters.getItemId(product.value)));

const productReviews = computed(() => {
  return reviewGetters.getItems(productReviewsData.value);
})

const saveReview = async (form: any) => {
  const targetId = Number(productGetters.getVariationId(product.value));
  if (form.type === 'review') {
    const params = {
      ...form,
      targetId: targetId,
    };
    await createProductReview(params);
  } else {
    const params = {
      ...form,
    };
    await createProductReview(params);
  }
  close();
};

watch(
  () => reviewsOpen.value,
  (value) => {
    if (value && productReviews.value.length === 0) {
      fetchProductReviews(Number(productGetters.getItemId(product.value)));
    }
  },
);
</script>
