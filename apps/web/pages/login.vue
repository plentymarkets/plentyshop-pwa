<template>
  <NuxtLayout name="login">
    <div class="text-lg text-center mt-2 font-medium">
      {{ $t('auth.login.heading') }}
    </div>
    <login :return-to-previous-page="true" />
  </NuxtLayout>
</template>
