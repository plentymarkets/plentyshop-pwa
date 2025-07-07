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
    <FooterBlock v-if="!route.meta.isBlockified" :content="footerContent as any" />
  </div>
</template>

<script setup lang="ts">
import FooterBlock from '~/components/blocks/Footer/Footer.vue';
definePageMeta({
  isBlockified: false,
});
const { data, getBlocks } = useCategoryTemplate();
await getBlocks('index', 'immutable', 'Footer');
let footerContent;
const route = useRoute();

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
usePageTitle();
useStructuredData().setLogoMeta();
</script>
