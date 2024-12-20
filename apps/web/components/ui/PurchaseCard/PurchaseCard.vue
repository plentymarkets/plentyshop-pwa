<template>
  <form
        @submit.prevent="handleAddToCart()"
        class="md:rounded-md md:sticky md:top-40"
        data-testid="purchase-card">
    <div class="relative">
      <div class="drift-zoom-image">
        <section class="max-w-[520px] ml-auto px-4 pt-6 lg:pt-0 lg:px-0">
          <div class="flex">
            <h1 class="font-bold g-32" data-testid="product-name">
              {{ productGetters.getName(product) }}
            </h1>
            <!-- <div class="ml-4 flex items-center justify-center">
              <WishlistButton
                              :product="product"
                              :quantity="quantitySelectorValue"
                              :square="viewport.isLessThan('lg')"
                              :class="{
                                'bottom-0 right-0 mr-2 mb-2 bg-white ring-1 ring-inset ring-neutral-200 !rounded-full':
                                  viewport.isLessThan('lg'),
                              }">
              </WishlistButton>
            </div> -->
          </div>
          <div class="flex items-center mt-2 ml-[-2px]" @click="scrollToReviews">
            <SfRating
                      size="base"
                      :half-increment="true"
                      :value="reviewGetters.getAverageRating(reviewAverage, 'half')"
                      :max="5" />
            <SfCounter class="ml-1" size="xs">{{ reviewGetters.getTotalReviews(reviewAverage) }}</SfCounter>
          </div>
          <div class="flex flex-col mt-2">
            <Price :price="priceWithProperties" :crossed-price="crossedPrice" />
            <div class="text-gray-600">
              <p class="g-12-m mt-1 text-gray-600">{{ product.variation.weightG }}g ({{ n(getKgPrice(product), 'currency') }}/kg )</p>
              <div class="g-12-m flex mb-4 mt-1">
                <span>{{ t('asterisk') }}</span>
                <span class="mr-1">{{ showNetPrices ? t('itemExclVAT') : t('itemInclVAT') }}</span>
                <span>{{ t('excludedShipping') }}</span>
              </div>
            </div>


            <!-- <div v-if="(productBundleGetters?.getBundleDiscount(product) ?? 0) > 0" class="m-auto">
              <UiTag :size="'sm'" :variant="'secondary'">{{
                t('procentageSavings', { percent: productBundleGetters.getBundleDiscount(product) })
                }}</UiTag>
            </div> -->
          </div>
          <LowestPrice :product="product" />
          <!-- <BasePrice
                     v-if="productGetters.showPricePerUnit(product)"
                     :base-price="basePriceSingleValue"
                     :unit-content="productGetters.getUnitContent(product)"
                     :unit-name="productGetters.getUnitName(product)" /> -->

          <!-- <div class="mt-2 variation-properties">
            <VariationProperties :product="product" />
          </div> -->

          <!-- <div
               v-if="productGetters.getShortDescription(product).length > 0"
               class="mb-4 font-normal typography-text-sm whitespace-pre-line break-words"
               data-testid="product-description">
            {{ productGetters.getShortDescription(product) }}
          </div> -->

          <!-- <BundleOrderItems v-if="product.bundleComponents" :product="product" /> -->
          <OrderProperties :product="product" />
          <!-- <ProductAttributes :product="product" /> -->
          <GraduatedPriceList :product="product" :count="quantitySelectorValue" />

          <div class="mt-4">
            <div class="flex flex-col md:flex-row flex-wrap gap-4">
              <UiQuantitySelector
                                  :min-value="productGetters.getMinimumOrderQuantity(product)"
                                  :value="quantitySelectorValue"
                                  @change-quantity="changeQuantity"
                                  class="min-w-[145px] flex-grow-0 flex-shrink-0 basis-0" />
              <SfTooltip
                         show-arrow
                         placement="top"
                         :label="isNotValidVariation || isSalableText"
                         class="flex-grow-[2] flex-shrink basis-auto whitespace-nowrap">
                <UiButton
                          type="submit"
                          data-testid="add-to-cart"
                          size="lg"
                          class="w-full h-full"
                          :disabled="loading || !productGetters.isSalable(product)">
                  <template #prefix>
                    <div v-if="!loading" class="flex row items-center">
                      <SfIconShoppingCart size="sm" />
                      {{ t('addToCart') }}
                    </div>
                    <div v-else>
                      <SfLoaderCircular size="sm" />
                    </div>
                  </template>
                </UiButton>
              </SfTooltip>
            </div>

            <!-- <div class="flex">
              <UiBadges class="ml-1" :product="product" :use-tags="false" :use-availability="true" />
            </div> -->

            <!-- <template v-if="showPayPalButtons">
              <PayPalExpressButton type="SingleItem" @validation-callback="paypalHandleAddToCart" class="mt-4" />
              <PayPalPayLaterBanner placement="product" :amount="priceWithProperties * quantitySelectorValue" />
            </template> -->
          </div>




          <section class="mt-4">
            <NuxtLazyHydrate when-visible>
              <!-- Produktbeschreibung -->
              <UiAccordionItem
                               summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none">
                <template #summary>
                  <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
                    Produktbeschreibung
                  </h2>
                </template>
                <div class="kl-product-desc" v-html="productGetters.getDescription(product)"></div>
              </UiAccordionItem>

              <!-- Produktinformationen -->
              <UiAccordionItem
                               summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none">
                <template #summary>
                  <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
                    Produktinformationen
                  </h2>
                </template>
                <div>
                  <div class="kl-details-container">
                    <div class="kl-details-row">
                      <div class="kl-details-cell kl-label">Artikelnummer</div>
                      <div class="kl-details-cell">{{ product?.variation?.number }}</div>
                    </div>
                    <div class="kl-details-row">
                      <div class="kl-details-cell kl-label">Verkehrsbezeichnung</div>
                      <div class="kl-details-cell">{{ getPropertyValue(6, 14) }}</div>
                    </div>
                    <div class="kl-details-row">
                      <div class="kl-details-cell kl-label">Hinweis</div>
                      <div class="kl-details-cell">
                        <span v-if="getManufacturerName(product) === 'Pringles'">Unter Schutzatmosphäre verpackt</span>
                        <span v-else>Kühl und trocken lagern</span>
                      </div>
                    </div>
                    <div class="kl-details-row">
                      <div class="kl-details-cell kl-label">Inhalt</div>
                      <div class="kl-details-cell">{{ getProductContent(product) }}</div>
                    </div>
                    <div class="kl-details-row">
                      <div class="kl-details-cell kl-label">Nettogewicht</div>
                      <div class="kl-details-cell">{{ productGetters.getWeightG(product) }}g</div>
                    </div>
                  </div>
                  <div class="kl-hersteller">
                    <KelloggsManufacturer :product="product" :manufacturer="getManufacturerName(product)" />
                  </div>
                </div>
              </UiAccordionItem>

              <!-- Zutaten -->
              <UiAccordionItem
                               summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none">
                <template #summary>
                  <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
                    Zutaten
                  </h2>
                </template>
                <div>
                  <div v-html="getPropertyValue(6, 42)"></div>
                </div>
              </UiAccordionItem>

              <!-- Durchschnittliche Nährwerte -->
              <UiAccordionItem
                               summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none">
                <template #summary>
                  <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
                    Durchschnittliche Nährwerte
                  </h2>
                </template>
                <div>
                  <div class="nutritionalValuescontent" v-html="getPropertyValue(6, 30)"></div>
                </div>
              </UiAccordionItem>

              <!-- Allergenkennzeichnung -->
              <UiAccordionItem
                               summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 pl-4 pr-3 flex justify-between items-center select-none">
                <template #summary>
                  <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
                    Allergenkennzeichnung
                  </h2>
                </template>
                <div>
                  {{ getPropertyValue(6, 41) }}
                </div>
              </UiAccordionItem>
            </NuxtLazyHydrate>
          </section>
        </section>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { productGetters, reviewGetters, productBundleGetters, Product } from '@plentymarkets/shop-api';
import { SfCounter, SfRating, SfIconShoppingCart, SfLoaderCircular, SfTooltip } from '@storefront-ui/vue';
import { type PurchaseCardProps } from '~/components/ui/PurchaseCard/types';
import { type PayPalAddToCartCallback } from '~/components/PayPal/types';

const { product, reviewAverage } = defineProps<PurchaseCardProps>();
const runtimeConfig = useRuntimeConfig();
const showNetPrices = runtimeConfig.public.showNetPrices;
const viewport = useViewport();
const { getCombination, updateValue, getValue, setAttribute } = useProductAttributes();
const { getPropertiesForCart, getPropertiesPrice } = useProductOrderProperties();
const { validateAllFields, invalidFields, resetInvalidFields } = useValidatorAggregator('properties');
const {
  validateAllFields: validateAllFieldsAttributes,
  invalidFields: invalidAttributeFields,
  resetInvalidFields: resetAttributeFields,
} = useValidatorAggregator('attributes');
const { send } = useNotification();
const { addToCart, loading } = useCart();
const { t, n } = useI18n();
const quantitySelectorValue = ref(productGetters.getMinimumOrderQuantity(product));
const { isWishlistItem } = useWishlist();
const { openQuickCheckout } = useQuickCheckout();
const { price, crossedPrice } = useProductPrice(product);
const { reviewArea } = useProductReviews(Number(productGetters.getId(product)));

resetInvalidFields();
resetAttributeFields();

// Automatically select the first available variant (otherwise the ProductAttributes component would be needed)
onMounted(() => {
  // TODO: Figure out why the hook alone is not enough
  setTimeout(() => {
    setAttribute(product, true);
  }, 300);
})

const getPropertyValue = (groupId: Number, propertyId: Number) => {
  return product?.variationProperties
    ?.find(group => group.id === groupId)
    ?.properties
    ?.find(property => property.id === propertyId)
    ?.values?.value;
}

const getManufacturerName = (product: Product) => {
  //@ts-ignore
  return product?.item?.manufacturer?.name;
}

const getProductContent = (product: Product) => {
  let vpe = getPropertyValue(6, 27);
  let unit = `${vpe ?? ''} ${getPropertyValue(6, 24) ?? ''}`;

  let contentInfoString = getPropertyValue(6, 64);
  let beinhaltet = (vpe && Number(vpe) > 1) ? 'beinhalten ' : 'beinhaltet ';
  if (contentInfoString) return unit + ' ' + beinhaltet + contentInfoString;

  return unit;
}

const getKgPrice = (product: Product) => {
  let weight = product?.variation?.weightG;
  if (!weight) return 0;

  return (price.value / weight) * 1000;
}

const priceWithProperties = computed(
  () =>
    (productGetters.getSpecialOffer(product) ||
      productGetters.getGraduatedPriceByQuantity(product, quantitySelectorValue.value)?.unitPrice.value ||
      0) + getPropertiesPrice(product),
);

const basePriceSingleValue = computed(
  () =>
    productGetters.getGraduatedPriceByQuantity(product, quantitySelectorValue.value)?.basePrice ??
    productGetters.getDefaultBasePrice(product),
);

const handleAddToCart = async (quickCheckout = true) => {
  await validateAllFieldsAttributes();
  await validateAllFields();
  if (invalidFields.value.length > 0 || invalidAttributeFields.value.length > 0) {
    const invalidFieldsNames = invalidFields.value.map((field) => field.name);
    const invalidAttributeFieldsNames = invalidAttributeFields.value.map((field) => field.name);
    send({
      message: [
        t('errorMessages.missingOrWrongProperties'),
        '',
        ...invalidAttributeFieldsNames,
        ...invalidFieldsNames,
        '',
        t('errorMessages.pleaseFillOutAllFields'),
      ],
      type: 'negative',
    });
    return false;
  }

  if (!getCombination()) {
    send({ message: t('productAttributes.notValidVariation'), type: 'negative' });
    return false;
  }

  const params = {
    productId: Number(productGetters.getId(product)),
    quantity: Number(quantitySelectorValue.value),
    basketItemOrderParams: getPropertiesForCart(),
  };

  const added = await addToCart(params);
  if (added) {
    if (quickCheckout) {
      openQuickCheckout(product, quantitySelectorValue.value);
    } else {
      send({ message: t('addedToCart'), type: 'positive' });
    }
  }
  return added;
};

const paypalHandleAddToCart = async (callback: PayPalAddToCartCallback) => {
  const added = await handleAddToCart(false);

  callback(added);
};

const changeQuantity = (quantity: string) => {
  quantitySelectorValue.value = Number(quantity);
};

const isReviewsAccordionOpen = () => {
  const customerReviewsAccordionDetailsElement = document.querySelector('#customerReviewsAccordion')
    ?.firstChild as HTMLDetailsElement;

  return customerReviewsAccordionDetailsElement.open;
};

const openReviewsAccordion = () => {
  const customerReviewsClickElement = document.querySelector('#customerReviewsClick') as HTMLElement;
  customerReviewsClickElement?.click();
};

const isSalableText = computed(() => (productGetters.isSalable(product) ? '' : t('itemNotAvailable')));
const isNotValidVariation = computed(() => (getCombination() ? '' : t('productAttributes.notValidVariation')));
const showPayPalButtons = computed(() => Boolean(getCombination()) && productGetters.isSalable(product));

const scrollToReviews = () => {
  if (!isReviewsAccordionOpen()) {
    openReviewsAccordion();
  }

  if (reviewArea.value) {
    reviewArea.value.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>


<style lang="scss">
.kl-hersteller {
  border-top: 1px solid black;
  margin-top: 25px;
  padding-bottom: 10px;
}

p,
ul li {
  margin-bottom: 0;
  font-weight: 500;
  line-height: 1.4;
  font-size: 16px;
  color: black;
}

p.kl-pd-title {
  font-weight: 700;
  margin-top: 20px;
}

p.kl-pd-title+p {
  margin-top: 0;
}

.kl-product-desc {
  &> :first-child {
    margin-top: 0px;
  }

  &> :last-child {
    padding-bottom: 25px;
  }
}

.kl-details-container {
  display: flex;
  flex-direction: column;
  width: 100%;

  * {
    color: black;
    letter-spacing: 0;
  }

  .kl-details-row {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .kl-details-cell {
      flex: 1;
      padding: 8px;
      border-bottom: 1px solid #e7e7e7;
      font-weight: 500;

      &.kl-label {
        font-weight: 700;
        min-width: 175px;
        padding-left: 0;
      }
    }

    .kl-details-table-top .kl-details-cell {
      font-weight: 700;
    }
  }
}

.nutritionalValuescontent {
  & > p {
    font-size: 14px;
    margin-top: 12px;
  }
}

#nutritions {
  width: 100%;
  border: none;
  box-shadow: none;
  line-height: 1.3;

  p {
    margin: 0;
  }

  tr {
    border: none;
    border-bottom: 1px solid #e7e7e7;

    td {
      padding: 10px 5px;
      border: none;
      font-weight: 500;
      font-size: 14px;

      p {
        font-weight: 500;
        font-size: 14px;
      }
    }

    td:first-child {
      font-weight: 700;
      color: black;

      p {
        font-weight: 700;
      }

      @media only screen and (min-width: 1000px) {
        width: 45%;
      }
    }

    td:nth-child(4) {
      text-align: right;
    }
  }

  tr:first-child {
    font-weight: 700;
    border-bottom: 1px solid black;
    white-space: nowrap;
  }

  tr:nth-child(3),
  tr:nth-child(5) {
    border-bottom: none;
  }

  tr:nth-child(4),
  tr:nth-child(6) {
    transform: translatey(-12px);

    td:first-child {
      font-weight: 500;

      p {
        font-weight: 500;
      }
    }

    td {
      padding: 10px 5px 0 5px;
    }
  }
}
</style>