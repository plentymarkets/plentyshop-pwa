<script setup>
import DefaultTheme from 'vitepress/theme';
import FeedbackWidget from './components/FeedbackWidget.vue';

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #home-hero-info-after>
      <p class="tagline">powered by<span class="logo-alokai"></span></p>
    </template>

    <template #layout-bottom>
      <FeedbackWidget />
    </template>
  </Layout>
</template>
