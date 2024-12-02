<template>
  <slot></slot>
</template>

<script setup lang="ts">
import Drift from 'drift-zoom';
import './Drift.scss';
import type { DriftProps } from '~/components/Drift/types';

const { index } = defineProps<DriftProps>();

let drift: Drift | null = null;

onMounted(() => {
  let demoTrigger = document.querySelector(`.demo-trigger-${index}`) as HTMLElement;
  let paneContainer = document.querySelector('.drift-zoom-image') as HTMLElement;

  drift = new Drift(demoTrigger, {
    paneContainer: paneContainer,
    containInline: true,
    zoomFactor: 2,
    hoverBoundingBox: true,
    handleTouch: true,
    touchDelay: 300,
    injectBaseStyles: true,
  });
});

onUnmounted(() => {
  if (drift) {
    drift.destroy();
    drift = null;
  }
});
</script>
