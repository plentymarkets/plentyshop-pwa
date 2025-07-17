<template>
  <UiDivider class="col-span-3 -mx-4 !w-auto md:mx-0" />
  <div v-if="!confirmation" class="col-span-3 !w-auto mx-4">
    <template v-if="currentReturnOrder">
      <div class="flex justify-between items-center mb-5 text-sm sm:typography-headline-4">
        <div class="md:grid grid-cols-[1fr_1fr] gap-3">
          <div class="text-neutral-900">
            <span class="font-bold"> {{ t('returns.returnForOrder') }}</span>
            <span> #{{ orderGetters.getId(currentReturnOrder) }}</span>
          </div>
          <div class="text-neutral-900">
            <span class="font-bold">{{ t('returns.orderDate') }}</span>
            <span>: {{ orderGetters.getDate(currentReturnOrder, locale) }}</span>
          </div>
        </div>
        <label
          for="selectAll"
          class="cursor-pointer w-fit select-none bg-white align-center align-baseline text-center border-2 border-primary-800 text-primary-800 rounded-lg px-3 py-1 flex items-center"
          @click="selectAll(!selectAllItems)"
        >
          <SfCheckbox id="selectAll" v-model="selectAllItems" class="text-primary-800 mr-2" value="value" />
          {{ t('returns.selectAll') }}
        </label>
      </div>

      <OrderReturnProductCard
        v-for="(item, index) in orderGetters.getItems(currentReturnOrder)"
        :key="item.id"
        :order="currentReturnOrder"
        :order-item="item"
        :index="index"
      />
    </template>
    <div class="flex flex-row justify-between mt-5">
      <UiButton :tag="NuxtLink" :to="localePath(paths.accountMyOrders)" variant="secondary" @close="close()">
        {{ t('account.back') }}
      </UiButton>
      <UiButton @click="initiateReturn()">
        {{ t('returns.initiateReturn') }}
        <SfIconArrowForward />
      </UiButton>
    </div>
  </div>
  <div v-else class="col-span-3 mt-8">
    <OrderReturnFormConfirmation @previous="previous()" />
  </div>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-api';
import { SfIconArrowForward, SfCheckbox } from '@storefront-ui/vue';
import { useReturnOrder } from '~/composables/useReturnOrder';
import { paths } from '~/utils/paths';

const route = useRoute();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');
const { t, locale } = useI18n();
definePageMeta({
  layout: 'account',
  pageType: 'static',
  middleware: ['auth-guard'],
});
const { currentReturnOrder, hasMinimumQuantitySelected, hasQuantityAndNoReasonsSelected, selectAll, cleanReturnData } =
  useReturnOrder();
const { fetchReturnReasons } = useCustomerReturns();
const { send } = useNotification();
fetchReturnReasons();
const runtimeConfig = useRuntimeConfig();
const selectAllItems = ref(false);
const confirmation = ref(false);
const emit = defineEmits(['close']);
const { setCurrentReturnOrder } = useReturnOrder();
const close = () => {
  confirmation.value = false;
  selectAllItems.value = false;
  emit('close');
};
const previous = () => {
  confirmation.value = false;
};
const initiateReturn = () => {
  if (!hasMinimumQuantitySelected.value) {
    send({
      type: 'negative',
      message: t('returns.selectQuantities'),
    });
    return;
  }
  if (runtimeConfig.public.validateReturnReasons && hasQuantityAndNoReasonsSelected.value) {
    send({
      type: 'negative',
      message: t('returns.selectReason'),
    });
    return;
  } else {
    confirmation.value = true;
  }
  cleanReturnData();
};

const { fetchOrder, data } = useCustomerOrder(route.params.id as string);

onMounted(async () => {
  await nextTick();
  await fetchOrder({
    orderId: route.params.id as string,
    accessKey: route.params.accessKey as string,
  });
  if (data.value) {
    setCurrentReturnOrder(data.value);
  }
});
</script>
