<template>
  <article class="demo-area">
    <slot></slot>
  </article>
</template>

<script setup lang="ts">
import Drift from 'drift-zoom';
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
  });
});
</script>

<style scoped>
.detail {
  position: relative;
  width: 65%;
  margin-left: 5%;
  float: left;
}

@media (max-width: 610px) {
  .detail,
  .demo-trigger {
    float: none;
  }

  .demo-trigger {
    display: block;
    width: 50%;
    max-width: 200px;
    margin: 0 auto;
  }

  .detail {
    margin: 0;
    width: auto;
  }

  p {
    margin: 0 auto 1em;
  }

  .responsive-hint {
    display: none;
  }
  h3 {
    margin-top: 20px;
  }
}
</style>

<style>
.drift-zoom-pane {
  background: white;
}

.drift-bounding-box {
  border: none !important;
  background: rgba(0, 0, 0, 0.5) !important;
  width: 160px !important;
  height: 160px !important;
}
</style>
