<template>
  <UiModal v-model="isOpen" tag="section" class="w-full h-full md:h-fit m-0 p-0 lg:w-[1000px] overflow-y-auto">
    <header>
      <h2 class="font-bold text-lg leading-6 md:text-2xl">
        <span>{{ t('account.ordersAndReturns.orderAgain.heading') }}</span>
      </h2>
      <div v-if="!loading">
        <div v-if="hasItemsChanged" class="font-medium">
          {{ t('account.ordersAndReturns.orderAgain.subtextChanges') }}
        </div>
        <div v-else class="font-medium">
          {{ t('account.ordersAndReturns.orderAgain.subtext') }}
        </div>
      </div>
      <div class="absolute right-2 top-2 flex items-center">
        <UiButton
          :aria-label="t('quickCheckout.close')"
          data-testid="quick-checkout-close"
          square
          variant="tertiary"
          @click="close"
        >
          <SfIconClose />
        </UiButton>
      </div>
    </header>

    <div class="w-full">
      <div
        class="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100 mb-4 max-h-[calc(100vh-225px)] md:max-h-[calc(100vh-270px)]"
      >
        <div v-if="!loading">
          <OrderAgainItem v-for="item in orderGetters.getItems(order)" :key="item.id" :item="item" :order="order" />
        </div>
        <div v-else class="w-full">
          <SkeletonsOrderAgainItem v-for="item in orderGetters.getItems(order)" :key="item.id" />
        </div>
      </div>
      <div class="h-auto flex-shrink-0 block sm:flex gap-2 relative mt-3">
        <div class="typography-text-xs flex gap-1 mb-3 sm:mb-0">
          <span>{{ t('asterisk') }}</span>
          <span v-if="showNetPrices">{{ t('itemExclVAT') }}</span>
          <span v-else>{{ t('itemInclVAT') }}</span>
          <i18n-t keypath="excludedShipping" scope="global">
            <template #shipping>
              <SfLink
                :href="localePath(paths.shipping)"
                target="_blank"
                class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
              >
                {{ t('delivery') }}
              </SfLink>
            </template>
          </i18n-t>
        </div>
        <div class="ml-auto float-right">
          <UiButton class="mr-2" variant="secondary" size="lg" @click="close()">
            {{ t('account.ordersAndReturns.orderAgain.cancel') }}
          </UiButton>
          <UiButton
            data-testid="quick-checkout-cart-button"
            :disabled="loading || loadingAddToCart || !canAddToCart"
            size="lg"
            variant="primary"
            @click="addToCart"
          >
            <SfLoaderCircular v-if="loadingAddToCart" class="flex justify-center items-center" size="sm" />
            <span v-else>{{ t('account.ordersAndReturns.orderAgain.addToCart') }}</span>
          </UiButton>
        </div>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { SfIconClose, SfLoaderCircular, SfLink } from '@storefront-ui/vue';
import type { OrderAgainProps } from './types';
import { orderGetters } from '@plentymarkets/shop-api';
import { paths } from '~/utils/paths';

const props = defineProps<OrderAgainProps>();
const { send } = useNotification();
const { isOpen, addOrderToCart, loading, hasItemsChanged } = useOrderAgain();
const { t } = useI18n();
const { showNetPrices } = useCart();

const localePath = useLocalePath();
const loadingAddToCart = ref(false);

const close = () => {
  isOpen.value = false;
};

const goToPage = (path: string) => {
  close();
  navigateTo(localePath(path));
};

const canAddToCart = computed(() => {
  return orderGetters.getItems(props.order).find((item) => {
    return orderGetters.isItemSalableAndActive(props.order, item) && orderGetters.hasAllOrderPropertiesAvailable(item);
  });
});

const addToCart = async () => {
  loadingAddToCart.value = true;
  if (await addOrderToCart()) {
    send({
      type: 'positive',
      message: t('addedToCart'),
    });
    goToPage(paths.cart);
  }
  loadingAddToCart.value = false;
};
</script>
