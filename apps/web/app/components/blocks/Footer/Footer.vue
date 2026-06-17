<template>
  <footer v-if="resolvedContent" data-testid="footer">
    <!-- Upper footer: logo + categories + legal -->
    <div class="footer-upper">
      <div class="max-w-[1536px] mx-auto px-6 lg:px-8 py-12 md:py-14">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <!-- Logo + description -->
          <div class="md:col-span-4">
            <NuxtLink :to="localePath('/')" class="inline-block mb-4">
              <img
                v-if="headerLogo"
                :src="headerLogo"
                :alt="storeName"
                class="h-9 md:h-11 w-auto object-contain brightness-0 invert"
                @error="($event.target as HTMLImageElement).style.display = 'none'"
              >
              <span v-else class="text-2xl font-light text-white italic tracking-wide">{{ storeName }}</span>
            </NuxtLink>
            <p class="text-sm leading-relaxed text-white/60 max-w-xs">
              {{ t('customFooter.description') }}
            </p>
          </div>

          <!-- Category links -->
          <div class="md:col-span-3">
            <h4 class="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              {{ t('customFooter.categoriesTitle') }}
            </h4>
            <ul class="space-y-2.5">
              <li v-for="cat in footerCategories" :key="cat.id">
                <NuxtLink
                  :to="localePath(cat.link)"
                  class="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {{ cat.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Plenty footer columns (legal etc.) -->
          <div class="md:col-span-3">
            <h4 class="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              {{ t('customFooter.legalTitle') }}
            </h4>
            <ul class="space-y-2.5">
              <li>
                <NuxtLink :to="localePath(paths.termsAndConditions)" class="text-sm text-white/70 hover:text-white transition-colors">
                  {{ t('legal.termsAndConditions') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath(paths.privacyPolicy)" class="text-sm text-white/70 hover:text-white transition-colors">
                  {{ t('legal.privacyPolicy') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath(paths.cancellationRights)" class="text-sm text-white/70 hover:text-white transition-colors">
                  {{ t('legal.cancellationRights') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath(paths.legalDisclosure)" class="text-sm text-white/70 hover:text-white transition-colors">
                  {{ t('legal.legalDisclosure') }}
                </NuxtLink>
              </li>
              <li>
                <a
                  id="hbRevocationButton"
                  href="https://connect.haendlerbund.de/widerrufsformular/www-b2b-hafenx-de/01KVA94FCJFEGSB99S8QGZ371Q"
                  data-shop-id="01KVA94FCJFEGSB99S8QGZ371Q"
                  data-key="gaZ4DUmNg2qulX2WFSo2q0dNHwesYTxk"
                  data-preview="false"
                  data-lang="de"
                  rel="noopener"
                  target="_blank"
                  :aria-label="t('customFooter.revocationButtonAria')"
                  class="text-sm text-white/70 hover:text-white transition-colors"
                >
                  <span>{{ t('customFooter.revocationButton') }}</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div class="md:col-span-2">
            <h4 class="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              {{ t('customFooter.contactTitle') }}
            </h4>
            <ul class="space-y-2.5">
              <li>
                <NuxtLink :to="localePath(paths.contact)" class="text-sm text-white/70 hover:text-white transition-colors">
                  {{ t('customFooter.contactLink') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath(paths.authLogin)" class="text-sm text-white/70 hover:text-white transition-colors">
                  {{ t('customFooter.loginLink') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="localePath(paths.register)" class="text-sm text-white/70 hover:text-white transition-colors">
                  {{ t('customFooter.registerLink') }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright bar -->
    <div class="footer-copyright">
      <div class="max-w-[1536px] mx-auto px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span class="text-xs text-white/40">
          &copy; {{ currentYear }} {{ storeName }}. {{ t('customFooter.allRightsReserved') }}
        </span>
        <span class="text-xs text-white/30">
          Powered by PlentyMarkets
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { FooterProps, FooterContent } from './types';
import type { CategoryTreeItem } from '@plentymarkets/shop-api';

const props = defineProps<FooterProps>();
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();

const { getFooterBlock, mapFooterData, createFooterBlock } = useBlockTemplates(
  'index',
  'immutable',
  useNuxtApp().$i18n.locale.value,
);

const { getSetting: getHeaderLogo } = useSiteSettings('headerLogo');
const headerLogo = computed(() => getHeaderLogo());
const storeName = runtimeConfig.public.storename || 'HafenX';
const currentYear = new Date().getFullYear();

const { data: categoryTree } = useCategoryTree();
const { buildCategoryMenuLink } = useLocalization();

const shouldRender = computed(() => {
  if (route.meta.isBlockified) return !!props.content;
  return true;
});

const resolvedContent = computed(() => {
  if (!shouldRender.value) return null;
  const block = props.content ? createFooterBlock(props.content, props.meta) : getFooterBlock();
  return mapFooterData(block).content as FooterContent;
});

useHead({
  script: [
    {
      src: 'https://connect.haendlerbund.de/widgets/revocation-button.js',
      async: true,
      tagPosition: 'bodyClose',
    },
  ],
});

interface FooterCategoryItem {
  id: number;
  name: string;
  link: string;
}

const footerCategories = computed((): FooterCategoryItem[] => {
  if (!categoryTree.value?.length) return [];

  const exclude = ['marken', 'kollektionen'];

  return categoryTree.value
    .filter((cat: CategoryTreeItem) => {
      if (cat.type !== 'item') return false;
      const name = (cat.details?.[0]?.name || '').toLowerCase();
      return !exclude.some((ex) => name.includes(ex));
    })
    .slice(0, 6)
    .map((cat: CategoryTreeItem) => ({
      id: cat.id,
      name: String(cat.details?.[0]?.name || `Category ${cat.id}`),
      link: buildCategoryMenuLink(cat, categoryTree.value) || '/',
    }));
});
</script>

<style scoped>
.footer-upper {
  background-color: #384d37;
  color: #ffffff;
}

.footer-copyright {
  background-color: #2c3e2b;
}
</style>
