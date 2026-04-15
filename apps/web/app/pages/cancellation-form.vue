<template>
  <div class="w-full p-5 overflow-x-auto no-preflight" v-html="getHTMLTexts()" />

  <div  class="mx-auto my-8 w-full max-w-4xl rounded-md border border-neutral-200 bg-white p-8">
    <h2 class="mb-6 text-2xl font-semibold text-neutral-900">
      {{ t('legal.cancellationForm') }}
    </h2>

    <form @submit.prevent="handlesubmit" class="space-y-6">
      <div>
        <UiFormLabel>Order ID {{ t('form.required') }}</UiFormLabel>
        <SfInput name="orderId" type="text" required />
      </div>

      <div>
        <UiFormLabel>Name {{ t('form.required') }}</UiFormLabel>
        <SfInput name="name" type="text" required />
      </div>

      <div>
        <UiFormLabel>Email {{ t('form.required') }}</UiFormLabel>
        <SfInput name="email" type="email" required />
      </div>

      <div>
        <UiFormLabel>
          Reason for Cancellation
          <UiFormHelperText class="inline">({{ t('form.optional') }})</UiFormHelperText>
        </UiFormLabel>
        <SfTextarea class="w-full" name="reason" type="text" />
      </div>

      <UiButton type="submit" variant="primary">Submit</UiButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n';
import { SfInput, SfTextarea } from '@storefront-ui/vue';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

const { data, getLegalTexts } = useLegalInformation();
const { getRobots, setRobotForStaticPage } = useRobots();
const { setPageMeta } = usePageMeta();

definePageMeta({
  pageType: 'static',
});

await getLegalTexts({
  type: 'WithdrawalForm',
});

const getHTMLTexts = () => {
  return data.value.htmlText ?? '';
};

await getRobots();
setRobotForStaticPage('CancellationForm');

const icon = 'page';
setPageMeta(t('legal.cancellationForm'), icon);

const handlesubmit = () => (
 console.log('submit')
)
</script>
