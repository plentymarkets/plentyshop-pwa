<template>
  <UiModal
    v-model="ggh"
    tag="section"
    class="h-full md:h-fit m-0 p-0 md:w-[1000px]"
    aria-labelledby="quick-checkout-modal"
  >
    <header>
      <div class="text-lg font-medium ml-8">
        <span v-if="true">{{ t('quick-checkout.heading') }}</span>
        <span v-else>{{ t('auth.signup.heading') }}</span>
      </div>
      <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close">
        <SfIconClose />
      </SfButton>
    </header>

    <div class="grid grid-cols-2 gap-4">
      <div class="border-r-2 flex flex-col items-center p-8">
        <NuxtImg
          :src="productGetters.getPreviewImage(product)"
          :alt="t('imageOfSth', { name: productGetters.getName(product) })"
          width="240"
          height="240"
          loading="lazy"
        />

        <h1 class="font-bold typography-headline-4" data-testid="product-name">
          {{ productGetters.getName(product) }}
        </h1>

        <div>
          <Price
            :price="currentActualPrice"
            :normal-price="normalPrice"
            :old-price="productGetters.getPrice(product).regular ?? 0"
          />
          <div v-if="(productBundleGetters?.getBundleDiscount(product) ?? 0) > 0" class="m-auto">
            <UiTag :size="'sm'" :variant="'secondary'">{{
              $t('procentageSavings', { percent: productBundleGetters.getBundleDiscount(product) })
            }}</UiTag>
          </div>
        </div>
        <LowestPrice :product="product" />
        <BasePrice
          v-if="productGetters.showPricePerUnit(product)"
          :base-price="basePriceSingleValue"
          :unit-content="productGetters.getUnitContent(product)"
          :unit-name="productGetters.getUnitName(product)"
        />

        <div
          class="mb-4 font-normal typography-text-sm"
          data-testid="product-description"
          v-html="productGetters.getShortDescription(product)"
        ></div>
      </div>
      <div>
        <SfButton
          data-testid="checkout-button"
          :tag="NuxtLink"
          :to="localePath(paths.checkout)"
          size="lg"
          class="w-full mb-4 md:mb-0"
        >
          {{ $t('goToCheckout') }}
        </SfButton>
        <div class="relative flex py-5 px-12 items-center">
          <div class="flex-grow border-t border-gray-400"></div>
          <span class="flex-shrink mx-4 text-gray-400">OR</span>
          <div class="flex-grow border-t border-gray-400"></div>
        </div>
        <PayPalExpressButton type="CartPreview" />
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { SfButton, SfIconClose } from '@storefront-ui/vue';
import type { QuickCheckoutProps } from './types';
import { productBundleGetters, productGetters } from '@plentymarkets/shop-sdk';

const props = defineProps<QuickCheckoutProps>();

const NuxtLink = resolveComponent('NuxtLink');
const { t } = useI18n();
const { addModernImageExtensionForGallery } = useModernImage();
const { getPropertiesPrice } = useProductOrderProperties();
const localePath = useLocalePath();

const ggh = ref(true);

const currentActualPrice = computed(
  () =>
    (productGetters.getGraduatedPriceByQuantity(props.product, 1)?.price.value ??
      productGetters.getPrice(props.product)?.special ??
      productGetters.getPrice(props.product)?.regular ??
      0) + getPropertiesPrice(props.product),
);

const normalPrice =
  productGetters.getGraduatedPriceByQuantity(props.product, 1)?.price.value ??
  productGetters.getPrice(props.product)?.special ??
  productGetters.getPrice(props.product)?.regular ??
  0;

const basePriceSingleValue = computed(
  () =>
    productGetters.getGraduatedPriceByQuantity(props.product, 1)?.baseSinglePrice ??
    productGetters.getDefaultBaseSinglePrice(props.product),
);

const close = () => {
  console.log('close');
};
</script>
