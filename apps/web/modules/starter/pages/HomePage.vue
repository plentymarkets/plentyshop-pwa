<template>
  <h1>Greetings from the Starter module</h1>
  <div>
    <p>The module overwrites the default homepage.</p>
  </div>
</template>

<script setup lang="ts">
import { useReadCookieBar } from '../../../composables/useReadCookieBar';

const { initializeCookies } = useReadCookieBar();

initializeCookies();
</script>
