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
const viewport = useViewport();
const isDesktop = computed(() => viewport.isGreaterOrEquals('lg'));

onMounted(() => {
  let demoTrigger = document.querySelector(`.demo-trigger-${index}`) as HTMLElement;
  let paneContainer = document.querySelector('.drift-zoom-image') as HTMLElement;

  new Drift(demoTrigger, {
    paneContainer: paneContainer,
    containInline: true,
    zoomFactor: isDesktop.value ? 3 : 2,
    hoverBoundingBox: true,
    handleTouch: true,
    touchDelay: 300,
    inlinePane: 768,
    injectBaseStyles: true,
  });
});
</script>
