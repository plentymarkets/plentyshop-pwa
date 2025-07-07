<template>
  <div>
    <UiHeader />
    <NarrowContainer v-if="breadcrumbs?.length" class="p-4 md:px-0">
      <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
    </NarrowContainer>
    <main>
      <slot />
    </main>
    <UiNavbarBottom v-if="viewport.isLessThan('lg')" />
    <Cookiebar />
    <PreviewMode />
    <FooterBlock v-if="!route.meta.isBlockified" :content="footerContent as any" />
    <QuickCheckout v-if="isOpen" :product="product" />
  </div>
</template>

<script setup lang="ts">
import type { DefaultLayoutProps } from '~/layouts/types';
import FooterBlock from '~/components/blocks/Footer/Footer.vue';

definePageMeta({
  isBlockified: false,
});
defineProps<DefaultLayoutProps>();
const { setLogoMeta } = useStructuredData();
const { isOpen, product } = useQuickCheckout();
const viewport = useViewport();
const route = useRoute();
setLogoMeta();

const { data, getBlocks } = useCategoryTemplate();
await getBlocks('index', 'immutable', 'Footer');
console.log('EditablePage data:', data.value);


let footerContent;
const footerBlock = data.value.find((block) => block.name === 'Footer');
if (footerBlock) {
  footerContent = footerBlock.content;
} else {
  footerContent = {
    column1: { title: 'Legal' },
    column2: { title: 'Contact', description: '', showContactLink: true },
    column3: { title: '', description: '' },
    column4: { title: '', description: '' },
    footnote: `© PlentyONE GmbH ${new Date().getFullYear()}`,
    footnoteAlign: 'right',
    colors: {
      background: '#cfe4ec',
      text: '#1c1c1c',
      noteBackground: '#161a16',
      noteText: '#959795',
    },
  };
}
</script>
