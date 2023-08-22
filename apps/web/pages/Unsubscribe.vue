<template>
  <div class="flex justify-center">
    <div class="flex flex-col ml-sf-sm">
      <h3 class="sf-title">
        {{ $t('MyNewsletter.Unsubscribe') }}
      </h3>
      <NewsletterUnsubscribeForm />
    </div>
  </div>
</template>

<script>
import { ref } from '@nuxtjs/composition-api';
import NewsletterUnsubscribeForm from '~/components/MyAccount/NewsletterUnsubscribeForm.vue';

export default {
  name: 'Unsubscribe',
  components: {
    NewsletterUnsubscribeForm,
  },
  setup() {
    const emailAddress = ref('');

    return {
      emailAddress,
    };
  },
};
</script>

<style lang="scss" scoped>
.sf-title {
  color: var(--_c-blue-primary);
  font-weight: bold;
}
</style>
