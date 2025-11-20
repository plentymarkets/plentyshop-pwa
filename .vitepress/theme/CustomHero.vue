<script setup>
import DefaultTheme from "vitepress/theme";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #home-hero-info-after>
      <p class="tagline">powered by<span class="logo-alokai"></span></p>
    </template>
  </Layout>
</template>
