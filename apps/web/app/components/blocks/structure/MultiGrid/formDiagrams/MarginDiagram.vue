<template>
  <svg :width="SVG_SIZE" :height="SVG_SIZE" :viewBox="`0 0 ${SVG_SIZE} ${SVG_SIZE}`" aria-hidden="true">
    <rect
      :x="EDGE_INSET"
      :y="EDGE_INSET"
      :width="CONTENT_WIDTH"
      :height="topBand"
      fill="#1d5ec7"
      opacity="0.18"
      rx="1.5"
    />
    <rect
      :x="EDGE_INSET"
      :y="contentY"
      :width="CONTENT_WIDTH"
      :height="contentHeight"
      fill="#f5f5f5"
      rx="2"
      stroke="#e2e2e2"
    />
    <rect
      :x="EDGE_INSET"
      :y="bottomBandY"
      :width="CONTENT_WIDTH"
      :height="bottomBand"
      fill="#1d5ec7"
      opacity="0.18"
      rx="1.5"
    />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  marginTop?: number;
  marginBottom?: number;
}>();

const SVG_SIZE = 44;
const EDGE_INSET = 2;
const BAND_GAP = 2;
const CONTENT_WIDTH = SVG_SIZE - EDGE_INSET * 2;
const VERTICAL_CHROME = EDGE_INSET * 2 + BAND_GAP * 2;

const MIN_BAND = 2;
const MAX_BAND = 16;
const MARGIN_PX_PER_BAND_UNIT = 3;

const toBandHeight = (marginPx: number) => Math.max(MIN_BAND, Math.min(MAX_BAND, marginPx / MARGIN_PX_PER_BAND_UNIT));

const topBand = computed(() => toBandHeight(props.marginTop ?? 0));
const bottomBand = computed(() => toBandHeight(props.marginBottom ?? 0));
const contentY = computed(() => EDGE_INSET + topBand.value + BAND_GAP);
const contentHeight = computed(() => SVG_SIZE - VERTICAL_CHROME - topBand.value - bottomBand.value);
const bottomBandY = computed(() => SVG_SIZE - EDGE_INSET - bottomBand.value);
</script>
