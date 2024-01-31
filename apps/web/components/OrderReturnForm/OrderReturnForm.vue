<template>
  <UiModal
    :model-value="isOpen"
    tag="section"
    role="dialog"
    class="h-full md:h-fit lg:!w-[60%]"
    aria-labelledby="return-modal-title"
  >
    <div v-if="!confirmation">
      <div v-if="currentReturnOrder" class="flex justify-between items-center mb-5">
        <div class="grid grid-cols-[1fr_1fr] gap-3">
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
          @click="selectAll()"
          for="selectAll"
          class="cursor-pointer bg-white align-center align-baseline text-center border-2 border-primary-800 text-primary-800 rounded-lg px-3 py-1 flex items-center"
        >
          <SfCheckbox class="text-primary-800 mr-2" id="selectAll" value="value" />
          {{ t('returns.selectAll') }}
        </label>
      </div>
      <div class="w-full" v-if="currentReturnOrder">
        <div>
          <SfScrollable direction="vertical" buttons-placement="none" class="!w-full max-h-[680px]">
            <div v-for="item in orderGetters.getItems(currentReturnOrder)" :key="item.id">
              <OrderReturnProductCard :order="currentReturnOrder" :order-item="item" />
            </div>
          </SfScrollable>
        </div>
      </div>
      <div class="flex flex-row justify-between mt-5">
        <SfButton @click="close()" variant="secondary"> {{ t('returns.cancel') }} </SfButton>
        <SfButton @click="confirmation = true">
          {{ t('returns.initiateReturn') }}
          <SfIconArrowForward />
        </SfButton>
      </div>
    </div>

    <OrderReturnFormConfirmation v-else @close="close()" />
  </UiModal>
</template>

<script setup lang="ts">
import { orderGetters } from '@plentymarkets/shop-sdk';
import { SfButton, SfCheckbox, SfIconArrowForward, SfScrollable } from '@storefront-ui/vue';
import { OrderReturnFormProps } from './types';
import OrderReturnFormConfirmation from '~/components/OrderReturnFormConfirmation/OrderReturnFormConfirmation.vue';

defineProps<OrderReturnFormProps>();

const emit = defineEmits(['close']);

const { currentReturnOrder, selectAll } = useReturnOrder();
const { t } = useI18n();

const confirmation = ref(false);

const close = () => {
  confirmation.value = false;
  emit('close');
};
</script>
