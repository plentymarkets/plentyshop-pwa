<template>
  <footer
    class="pt-10 md:mb-0 relative block-wrapper"
    data-testid="footer"
    :class="[
      simplifiedFooter ? 'mb-0' : 'mb-[58px]',
      { 'outline outline-4 outline-[#538AEA]': showOutline },
      { 'hover:outline hover:outline-4 hover:outline-[#538AEA]': showFooterHoverOutline },
    ]"
    :style="{ cursor: isPreview && disableActions ? 'pointer' : '', backgroundColor: footerSettings.colors.background, }"
    :tabindex="isPreview && disableActions ? 0 : undefined"
    @click="handleFooterClick"
  >
    <div
      class="grid justify-center grid-cols-[1fr_1fr] md:grid-cols-[repeat(4,1fr)] px-4 md:px-6 pb-10 max-w-screen-3xl mx-auto"
      data-testid="section-top"
    >
      <div v-for="{ key, subcategories } in categories" :key="key" class="min-w-[25%] xs:min-w-[50%] flex flex-col">
        <div   :style="{ color: footerSettings.colors.text }" class="ml-4 text-lg font-medium leading-7">
          {{ t(`categories.${key}.label`) }}
        </div>
        <ul>
          <SfListItem
            v-for="{ key: subcategoryKey, link } in subcategories"
            :key="subcategoryKey"
            class="py-2 !bg-transparent typography-text-sm"
          >
            <SfLink
              :tag="NuxtLink"
               :style="{ color: footerSettings.colors.text }"
              class="router-link-active router-link-exact-active no-underline hover:underline active:underline"
              variant="secondary"
              :to="localePath(link)"
            >
              {{ t(`categories.${key}.subcategories.${subcategoryKey}`) }}
            </SfLink>
          </SfListItem>
        </ul>
      </div>
    </div>
    <hr />

    <div class="bg-neutral-900" data-testid="section-bottom">
      <div class="justify-end px-4 py-10 md:flex md:py-6 max-w-screen-3xl mx-auto">
        <p class="flex items-center justify-center leading-5 text-center typography-text-sm text-white/50 md:ml-6">
          {{ companyName }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { SfLink, SfListItem } from '@storefront-ui/vue';
import { categories } from '~/mocks';
import type { FooterProps } from './types';

const { footerSettings } = useSiteConfiguration();

const storename: string = useRuntimeConfig().public.storename;

const companyName: string = `© ${storename} ${new Date().getFullYear()}`;

const { simplifiedFooter = false } = defineProps<FooterProps>();

const { t } = useI18n();
const localePath = useLocalePath();
const NuxtLink = resolveComponent('NuxtLink');

const { isClicked, clickedBlockIndex, isTablet } = useBlockManager();
const isPreview = useState('isPreview');
const { disableActions } = useEditor();
const root = true;
const isDragging = ref(false);

const showOutline = computed(
  () => isPreview.value && disableActions.value && isClicked.value && isTablet.value && clickedBlockIndex.value === 0,
);

const showFooterHoverOutline = computed(
  () => isPreview.value && disableActions.value && !isTablet.value && root && !isDragging.value,
);

function handleFooterClick() {
  if (isTablet.value) {
    isClicked.value = !isClicked.value;
    clickedBlockIndex.value = isClicked.value ? 0 : null;
  }
}
</script>
