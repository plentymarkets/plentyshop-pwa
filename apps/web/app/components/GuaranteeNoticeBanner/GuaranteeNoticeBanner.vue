<template>
  <img v-if="guaranteeNoticeSrc" :src="guaranteeNoticeSrc" :alt="t('checkout.guaranteeNotice')" class="h-auto w-full" />
</template>

<script setup lang="ts">
const guaranteeNoticeSvgs = import.meta.glob<string>('~/assets/legal/guarantee_notice/*.svg', {
  eager: true,
  import: 'default',
});

const localeOverrides: Record<string, string> = {
  se: 'SV',
  cz: 'CS',
};

const { locale } = useI18n();

function findSvg(fileCode: string) {
  return Object.entries(guaranteeNoticeSvgs).find(([key]) => key.endsWith(`guarantee_notice_${fileCode}.svg`))?.[1];
}

const guaranteeNoticeSrc = computed(() => {
  const fileCode = (localeOverrides[locale.value] ?? locale.value).toUpperCase();

  return findSvg(fileCode) ?? findSvg('EN');
});
</script>
