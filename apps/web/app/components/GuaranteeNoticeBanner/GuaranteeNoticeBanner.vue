<template>
  <img :src="guaranteeNoticeSrc" alt="" class="h-auto w-full" />
</template>

<script setup lang="ts">
const guaranteeNoticeSvgs = import.meta.glob<string>('~/assets/legal/guarantee_notice/*.svg', {
  eager: true,
  import: 'default',
});

const localeToFileCode: Record<string, string> = {
  de: 'DE',
  en: 'EN',
  bg: 'BG',
  fr: 'FR',
  it: 'IT',
  es: 'ES',
  nl: 'NL',
  pl: 'PL',
  pt: 'PT',
  ro: 'RO',
  da: 'DA',
  se: 'SV',
  cz: 'CS',
  sk: 'SK',
};

const { locale } = useI18n();

const guaranteeNoticeSrc = computed(() => {
  const fileCode = localeToFileCode[locale.value] ?? 'EN';
  const match = Object.entries(guaranteeNoticeSvgs).find(([key]) => key.endsWith(`guarantee_notice_${fileCode}.svg`));

  return match?.[1];
});
</script>
