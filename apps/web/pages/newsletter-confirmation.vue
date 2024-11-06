<template>
  <div class="w-full p-8 overflow-x-auto text-center" v-if="emailConfirmed">
    {{ $t('emailConfirmation.newsletterOptInMessage') }}
  </div>
  <div class="w-full p-8 overflow-x-auto text-center" v-else>
    {{ $t('emailConfirmation.newsletterOptInMessageError') }}
  </div>
</template>

<script setup lang="ts">
const { confirmEmail } = useNewsletterConfirmation();
const route = useRoute();
definePageMeta({
  layout: 'default',
  pageType: 'static',
});
let emailConfirmed = false;
if (route.query.newsletterEmailId && route.query.authString) {
  const response = await confirmEmail(route.query.newsletterEmailId.toString(), route.query.authString.toString());
  if (response && response.data) {
    emailConfirmed = true;
  }
}
</script>
