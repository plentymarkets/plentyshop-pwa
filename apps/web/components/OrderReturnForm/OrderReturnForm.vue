<template>
  <UiModal
    :model-value="isOpen"
    tag="section"
    role="dialog"
    class="h-fit max-h-full overflow-y-auto !w-[95%] 3xl:!w-[60%]"
    aria-labelledby="return-modal-title"
  >
    <header class="mb-4">
      <SfButton square variant="tertiary" class="absolute right-2 top-2" @click="close()">
        <SfIconClose />
      </SfButton>
    </header>
    <div v-if="!confirmation">
      <template v-if="currentReturnOrder">
        <div class="md:flex justify-between items-center mb-5">
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
            class="cursor-pointer w-fit select-none bg-white align-center align-baseline text-center border-2 border-primary-800 text-primary-800 rounded-lg px-3 py-1 flex items-center"
          >
            <SfCheckbox class="text-primary-800 mr-2" id="selectAll" v-model="selectAllItems" value="value" />
            {{ t('returns.selectAll') }}
          </label>
        </div>

        <OrderReturnProductCard
          v-for="(item, index) in orderGetters.getItems(currentReturnOrder)"
          :order="currentReturnOrder"
          :order-item="item"
          :index="index"
          :key="item.id"
        />
      </template>

      <div class="flex flex-row justify-between mt-5">
        <SfButton @click="close()" variant="secondary"> {{ t('returns.cancel') }} </SfButton>
        <SfButton @click="initiateReturn()">
          {{ t('returns.initiateReturn') }}
          <SfIconArrowForward />
        </SfButton>
      </div>
    </div>

    <OrderReturnFormConfirmation v-else @closed="close()" @previous="previous()" />
  </UiModal>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-api';
import { SfButton, SfCheckbox, SfIconArrowForward, SfIconClose } from '@storefront-ui/vue';
import type { OrderReturnFormProps } from './types';

defineProps<OrderReturnFormProps>();

const emit = defineEmits(['close']);

const { currentReturnOrder, hasMinimumQuantitySelected, hasQuantityAndNoReasonsSelected, selectAll, cleanReturnData } =
  useReturnOrder();
const { t } = useI18n();
const { fetchReturnReasons } = useCustomerReturns();
const { send } = useNotification();
fetchReturnReasons();

const runtimeConfig = useRuntimeConfig();
const confirmation = ref(false);
const selectAllItems = ref(false);

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
  }
  cleanReturnData();
  confirmation.value = true;
};
</script>
