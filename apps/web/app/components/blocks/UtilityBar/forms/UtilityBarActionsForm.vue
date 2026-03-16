<template>
  <div class="block-form-section">
    <UiAccordionItem
      v-model="actionsOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('actions-section-label') }}</h2>
      </template>

      <div class="space-y-6 py-4">
        <div>
          <UiFormLabel class="mb-3 block">{{ getEditorTranslation('actions-order-label') }}</UiFormLabel>

          <draggable v-model="actionOrder" item-key="id" handle=".drag-action-handle" class="space-y-2">
            <template #item="{ element: action }">
              <div :key="action.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                <div class="flex items-center gap-3 flex-1">
                  <button
                    class="drag-action-handle cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                    :aria-label="getEditorTranslation('drag-action-arial')"
                  >
                    <NuxtImg width="16" height="16" :src="dragIcon" />
                  </button>
                  <span class="text-sm font-medium">{{ getActionLabel(action.id) }}</span>
                </div>

                <SfSwitch
                  :model-value="action.visible"
                  :aria-label="getEditorTranslation('toggle-action-arial')"
                  class="checked:bg-editor-button"
                  @update:model-value="toggleActionVisibility(action.id, Boolean($event))"
                />
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';
import draggable from 'vuedraggable/src/vuedraggable';
import dragIcon from '~/assets/icons/paths/drag.svg';
import type { ActionType, ActionsSettings, ActionOrderItem, UtilityBarFormProps } from '../types';

const props = defineProps<UtilityBarFormProps>();

const actionsOpen = ref(true);
const { content } = useUtilityBarState(props.uuid);
const defaultActionOrder: ActionType[] = ['language', 'wishlist', 'cart', 'account'];

const actionsConfig = computed<ActionsSettings>({
  get: () => content.value.actions,
  set: (newActionsSettings) => {
    content.value = { ...content.value, actions: newActionsSettings };
  },
});

const actionOrder = computed<ActionOrderItem[]>({
  get: () =>
    (actionsConfig.value.order || defaultActionOrder).map((actionId: ActionType) => ({
      id: actionId,
      visible: actionsConfig.value.visibility?.[actionId] !== false,
    })),
  set: (value: ActionOrderItem[]) => {
    const newConfig: ActionsSettings = {
      ...actionsConfig.value,
      order: value.map((item) => item.id),
      visibility: {
        ...actionsConfig.value.visibility,
      },
    };
    value.forEach((item) => {
      newConfig.visibility[item.id] = item.visible;
    });
    actionsConfig.value = newConfig;
  },
});

const getActionLabel = (actionId: ActionType): string => {
  const labels: Record<ActionType, string> = {
    language: getEditorTranslation('language-action-label'),
    wishlist: getEditorTranslation('wishlist-action-label'),
    cart: getEditorTranslation('cart-action-label'),
    account: getEditorTranslation('account-action-label'),
  };
  return labels[actionId] || actionId;
};

const toggleActionVisibility = (actionId: ActionType, visible: boolean) => {
  const updatedConfig = {
    ...actionsConfig.value,
    visibility: {
      ...actionsConfig.value.visibility,
      [actionId]: visible,
    },
  };
  actionsConfig.value = updatedConfig;
};
</script>

<i18n lang="json">
{
  "en": {
    "actions-section-label": "Actions Settings",
    "actions-order-label": "Actions Order",
    "drag-action-arial": "Drag to reorder action",
    "toggle-action-arial": "Toggle action visibility",
    "language-action-label": "Language Selector",
    "wishlist-action-label": "Wishlist",
    "cart-action-label": "Cart",
    "account-action-label": "Account"
  },
  "de": {
    "actions-section-label": "Actions Settings",
    "actions-order-label": "Actions Order",
    "drag-action-arial": "Drag to reorder action",
    "toggle-action-arial": "Toggle action visibility",
    "language-action-label": "Language Selector",
    "wishlist-action-label": "Wishlist",
    "cart-action-label": "Cart",
    "account-action-label": "Account"
  }
}
</i18n>
