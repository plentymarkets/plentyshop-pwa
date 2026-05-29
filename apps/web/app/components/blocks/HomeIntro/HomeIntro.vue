<template>
  <section class="w-full px-4 md:px-6 lg:px-8 2xl:px-0 pb-4" data-testid="home-intro">
    <div class="mx-auto max-w-screen-3xl space-y-4">
      <div class="text-center space-y-2 sm:space-y-3">
        <h1 :class="h1Class" data-testid="home-intro-title">
          {{ title }}
        </h1>

        <h2 :class="h2Class" data-testid="home-intro-subtitle">
          {{ subtitle }}
        </h2>
      </div>

      <div class="mx-auto w-full max-w-5xl space-y-4 sm:space-y-5">
        <p :class="paragraphClass" data-testid="home-intro-lead">
          {{ lead }}
        </p>

        <h2 :class="[h2Class, 'text-center']" data-testid="home-intro-about-heading">{{ aboutHeading }}</h2>

        <p :class="paragraphClass" data-testid="home-intro-about">
          {{ about }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HomeIntroProps } from './types';
import { getDefaultHomeIntroContent } from './defaults';

const props = defineProps<HomeIntroProps>();

const defaults = getDefaultHomeIntroContent();
const title = computed(() => props.content?.title?.trim() || defaults.title);
const subtitle = computed(() => props.content?.subtitle?.trim() || defaults.subtitle);
const lead = computed(() => props.content?.lead?.trim() || defaults.lead);
const aboutHeading = computed(() => props.content?.aboutHeading?.trim() || defaults.aboutHeading);
const about = computed(() => props.content?.about?.trim() || defaults.about);

const h1Class = 'text-2xl sm:text-2xl font-semibold';
const h2Class = 'text-lg sm:text-xl font-semibold';
const paragraphClass = 'text-sm sm:text-base leading-relaxed';
</script>
