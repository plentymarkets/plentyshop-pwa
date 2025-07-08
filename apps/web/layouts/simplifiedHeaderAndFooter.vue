<template>
  <div>
    <UiSimplifiedHeader />
    <main>
      <slot />
    </main>
    <NuxtLazyHydrate when-idle>
      <Cookiebar />
      <PreviewMode />
    </NuxtLazyHydrate>
    <FooterBlock v-if="!route.meta.isBlockified" :content="footerContent as FooterSettings" />
  </div>
</template>

<script setup lang="ts">
import FooterBlock from '~/components/blocks/Footer/Footer.vue';
import type { FooterSettings } from '~/components/blocks/Footer/types';
import { v4 as uuid } from 'uuid';
const { t } = useI18n();

definePageMeta({
  isBlockified: false,
});
const route = useRoute();
const { data, getBlocks } = useCategoryTemplate();
await getBlocks('index', 'immutable', 'Footer');
let footerContent: FooterSettings;

const footerBlock = data.value.find((block) => block.name === 'Footer');
if (footerBlock) {
  footerContent = footerBlock.content as FooterSettings;
} else {
  footerContent = {
    meta: {
      uuid: uuid(),
      isGlobalTemplate: true,
    },
    column1: { title: t('categories.legal.label') },
    column2: { title: t('categories.contact.label'), description: '', showContactLink: true },
    column3: { title: '', description: '' },
    column4: { title: '', description: '' },
    footnote: `© PlentyONE GmbH ${new Date().getFullYear()}`,
    footnoteAlign: 'right',
    colors: {
      background: '#cfe4ec',
      text: '#1c1c1c',
      footnoteBackground: '#161a16',
      footnoteText: '#959795',
    },
  };
}
usePageTitle();
useStructuredData().setLogoMeta();
</script>
