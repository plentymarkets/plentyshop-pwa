<template>
  <UiModal
    :model-value="isOpen"
    tag="section"
    role="dialog"
    class="h-full md:h-fit !w-[95%] 3xl:!w-[60%]"
    aria-labelledby="return-modal-title"
  >
    <div v-if="!confirmation">
      <div v-if="currentReturnOrder" class="md:flex justify-between items-center mb-5">
        <div class="md:grid grid-cols-[1fr_1fr] gap-3">
          <div class="text-neutral-900">
            <span class="font-bold"> {{ t('returns.returnForOrder') }} </span> #
            {{ orderGetters.getId(currentReturnOrder) }}
          </div>
          <div class="text-neutral-900">
            <span class="font-bold">{{ t('returns.orderDate') }} </span>
            : {{ orderGetters.getDate(currentReturnOrder) }}
          </div>
        </div>
        <label
          @click="selectAll(!selectAllItems)"
          for="selectAll"
          class="cursor-pointer bg-white align-center align-baseline text-center border-2 border-primary-800 text-primary-800 rounded-lg px-3 py-1 flex items-center"
        >
          <SfCheckbox class="text-primary-800 mr-2" id="selectAll" v-model="selectAllItems" value="value" />
          {{ t('returns.selectAll') }}
        </label>
      </div>
      <div class="w-full" v-if="currentReturnOrder">
        <SfScrollable direction="vertical" buttons-placement="none" class="!w-full max-h-[680px]">
          <div v-for="item in orderGetters.getItems(currentReturnOrder)" :key="item.id">
            <OrderReturnProductCard :order="currentReturnOrder" :order-item="item" />
          </div>
        </SfScrollable>
      </div>
      <div class="flex flex-row justify-between mt-5">
        <SfButton @click="close()" variant="secondary"> {{ t('returns.cancel') }} </SfButton>
        <SfButton @click="confirmation = true" :disabled="!canInitiate">
          {{ t('returns.initiateReturn') }}
          <SfIconArrowForward />
        </SfButton>
      </div>
    </div>

    <OrderReturnFormConfirmation v-else @closed="close()" />
  </UiModal>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-sdk';
import { SfButton, SfCheckbox, SfIconArrowForward, SfScrollable } from '@storefront-ui/vue';
import { OrderReturnFormProps } from './types';

defineProps<OrderReturnFormProps>();

const emit = defineEmits(['close']);

const { currentReturnOrder, selectAll, returnData } = useReturnOrder();
const { t } = useI18n();
const { fetchReturnReasons } = useCustomerReturns();

fetchReturnReasons();

const confirmation = ref(false);
const selectAllItems = ref(false);

const canInitiate = computed(() =>
  Object.values(returnData?.value?.variationIds || {}).some((item) => item.quantity >= 1),
);

const close = () => {
  confirmation.value = false;
  selectAllItems.value = false;
  emit('close');
};
</script>
