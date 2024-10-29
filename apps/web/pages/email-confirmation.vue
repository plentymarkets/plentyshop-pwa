<template>
  <div class="w-full p-8 overflow-x-auto text-center" v-if="emailConfirmed">
    {{ $t('emailConfirmation.newsletterOptInMessage') }}
  </div>
  <div class="w-full p-8 overflow-x-auto text-center" v-else>
    {{ $t('emailConfirmation.newsletterOptInMessageError') }}
  </div>
</template>

<script setup lang="ts">
const { confirmEmail } = useNewsletter();
const route = useRoute();
definePageMeta({
  layout: 'default',
  pageType: 'static',
});
let emailConfirmed = false;
const response = await confirmEmail({
  newsletterEmailId: route.params.newsletterEmailId.toString(),
  authString: route.params.authString.toString(),
});
if (response) {
  emailConfirmed = true;
}
</script>
