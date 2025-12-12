<script setup lang="ts">
import type { Locale } from '#i18n';
defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});
definePageMeta({
  layout: 'account',
  pageType: 'static',
  middleware: ['auth-guard'],
});
</script>
