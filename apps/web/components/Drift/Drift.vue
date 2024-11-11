<template>
  <article class="demo-area">
    <slot></slot>
  </article>
</template>

<script setup lang="ts">
import Drift from 'drift-zoom';
import './Drift.scss';
import type { DriftProps } from '~/components/Drift/types';

const { index } = defineProps<DriftProps>();

onMounted(() => {
  let demoTrigger = document.querySelector(`.demo-trigger-${index}`) as HTMLElement;
  let paneContainer = document.querySelector('.drift-zoom-image') as HTMLElement;

  new Drift(demoTrigger, {
    paneContainer: paneContainer,
    containInline: true,
    zoomFactor: 3,
    hoverBoundingBox: true,
    inlinePane: 375,
    handleTouch: true,
    touchDelay: 200,
    inlineOffsetY: -85,
    injectBaseStyles: true, // Ensure base styles are injected
  });
});
</script>
