<template>
  <section class="w-full px-4 md:px-6 lg:px-8 2xl:px-0 pb-4" data-testid="home-intro">
    <div class="mx-auto max-w-screen-3xl space-y-4">
      <div class="text-center">
        <h1 :class="h1Class" data-testid="home-intro-title">
          <span class="block">{{ titleLines[0] }}</span>
          <span v-if="titleLines[1]" class="block">{{ titleLines[1] }}</span>
        </h1>
      </div>

      <div class="mx-auto w-full max-w-5xl space-y-4 sm:space-y-5">
        <p :class="paragraphClass" data-testid="home-intro-lead">
          {{ lead }}
        </p>

        <p :class="paragraphClass" data-testid="home-intro-about">
          {{ about }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HomeIntroProps } from './types';
import { DEFAULT_HOME_INTRO_TITLE } from './defaults';
import { normalizeHomeIntroContent } from './utils';

const props = defineProps<HomeIntroProps>();

const normalized = computed(() => normalizeHomeIntroContent(props.content ?? {}));

const title = computed(() => normalized.value.title ?? DEFAULT_HOME_INTRO_TITLE);

const titleLines = computed(() => {
  const text = title.value.trim();
  const breakAfter = 'Industriebedarf,';
  const idx = text.indexOf(breakAfter);

  if (idx !== -1) {
    const splitAt = idx + breakAfter.length;
    const line1 = text.slice(0, splitAt).trim();
    const line2 = text.slice(splitAt).trim();
    return line2 ? [line1, line2] : [line1];
  }

  return [text];
});

const lead = computed(() => normalized.value.lead);
const about = computed(() => normalized.value.about);

const h1Class =
  'mx-auto max-w-[20rem] sm:max-w-[28rem] md:max-w-[36rem] lg:max-w-[42rem] text-center text-2xl sm:text-2xl font-semibold leading-snug sm:leading-tight';
const paragraphClass = 'text-sm sm:text-base leading-relaxed';
</script>
