<template>
  <footer
    v-if="resolvedContent"
    class="pt-10"
    :style="{
      backgroundColor: resolvedContent.colors?.background,
      color: resolvedContent.colors?.text,
    }"
    data-testid="footer"
  >
    <div class="px-4 md:px-6 pb-10 max-w-screen-3xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div v-if="hasColumn1Content" class="max-w-[280px] break-words">
          <div class="ml-4 text-lg font-medium leading-7">
            {{ resolvedContent.column1?.title }}
          </div>
          <ul>
            <SfListItem
              v-for="switchConfig in getColumnSwitches(resolvedContent.column1)"
              :key="switchConfig.id"
              class="py-2 !bg-transparent typography-text-sm"
            >
              <SfLink
                :tag="NuxtLink"
                :style="{ color: resolvedContent.colors?.text || undefined }"
                class="no-underline text-neutral-600 hover:underline active:underline"
                variant="secondary"
                :to="localePath(switchConfig.link)"
              >
                {{ switchConfig.translationKey }}
              </SfLink>
            </SfListItem>
          </ul>
          <div v-if="hasColumn1Button" class="px-4 pt-2 flex">
            <UiButton
              :tag="NuxtLink"
              :to="localePath(paths.cancellationForm)"
              size="sm"
              class="text-xs leading-5"
              data-testid="footer-cancellation-button"
            >
              {{ t('legal.withdrawButton') }}
            </UiButton>
          </div>
        </div>

        <div
          v-for="(column, i) in [resolvedContent.column2, resolvedContent.column3, resolvedContent.column4]"
          :key="i"
          class="max-w-[280px] break-words"
        >
          <div class="ml-4 text-lg font-medium leading-7">
            {{ column?.title }}
          </div>
          <div v-if="getColumnSwitches(column).length" class="text-sm">
            <ul>
              <SfListItem
                v-for="switchConfig in getColumnSwitches(column)"
                :key="switchConfig.id"
                class="inline-flex items-center gap-2 w-full hover:bg-neutral-100 active:bg-neutral-200 cursor-pointer focus-visible:outline focus-visible:outline-offset focus-visible:relative focus-visible:z-10 px-4 py-2 !bg-transparent typography-text-sm"
              >
                <SfLink
                  :tag="NuxtLink"
                  variant="secondary"
                  class="no-underline text-neutral-900 hover:cursor-pointer hover:underline active:underline"
                  :style="{ color: resolvedContent.colors?.text }"
                  :to="localePath(switchConfig.link)"
                >
                  {{ switchConfig.translationKey }}
                </SfLink>
              </SfListItem>
            </ul>
          </div>
          <TextContent
            v-if="column?.description"
            v-bind="mapToTextContentProps({ htmlDescription: column.description })"
          />
        </div>
      </div>
    </div>
    <div>
      <div
        v-if="resolvedContent.footnote && resolvedContent.footnote.trim() !== ''"
        class="text-sm py-10 md:py-6 px-10 no-preflight"
        :class="{
          'text-left': resolvedContent.footnoteAlign === 'left',
          'text-center': resolvedContent.footnoteAlign === 'center',
          'text-right': resolvedContent.footnoteAlign === 'right',
        }"
        :style="{
          color: resolvedContent.colors?.footnoteText,
          backgroundColor: resolvedContent.colors?.footnoteBackground,
        }"
        v-html="resolvedContent.footnote"
      />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SfLink, SfListItem } from '@storefront-ui/vue';
import type { FooterProps, FooterContent, FooterColumn } from './types';
import { FOOTER_SWITCH_DEFINITIONS } from './constants';

const props = defineProps<FooterProps>();
const route = useRoute();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');
const { footer } = useBlocks();

const { t } = useI18n();
const { enableContractWithdrawalButton } = useRuntimeConfig().public;
const shouldRender = computed(() => {
  if (route.meta.isBlockified) return !!props.content;
  return true;
});

const resolvedContent = computed(() => {
  if (!shouldRender.value) return null;

  const content = props.content ?? footer.value?.content;
  return (content ?? null) as FooterContent | null;
});
const hasColumn1Button = computed(() => {
  return !!(enableContractWithdrawalButton && resolvedContent.value?.column1?.showCancellationForm);
});

const hasColumn1Content = computed(() => {
  if (!resolvedContent.value?.column1) return false;

  return getColumnSwitches(resolvedContent.value.column1).length > 0 || hasColumn1Button.value;
});
const getColumnSwitches = (column: FooterColumn) => {
  return FOOTER_SWITCH_DEFINITIONS.filter((switchConfig) => {
    if (column[switchConfig.key] !== true) return false;

    return !(enableContractWithdrawalButton && switchConfig.key === 'showCancellationForm');
  }).map((switchConfig) => ({
    id: `${switchConfig.key}-switch`,
    translationKey: t(switchConfig.shopTranslationKey),
    link: switchConfig.link,
    state: true,
  }));
};
</script>
