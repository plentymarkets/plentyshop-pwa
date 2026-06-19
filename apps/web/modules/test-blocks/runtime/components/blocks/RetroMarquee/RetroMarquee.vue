<template>
  <div class="retro-marquee w-full overflow-hidden py-3 border-y-2" :style="containerStyle" data-testid="retro-marquee">
    <div class="retro-marquee__track" :style="trackStyle">
      <span class="retro-marquee__text">{{ props.content.text }}</span>
      <span class="retro-marquee__text">{{ props.content.text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RetroMarqueeProps } from './types';

const props = defineProps<RetroMarqueeProps>();

const containerStyle = computed(() => ({
  backgroundColor: props.content.backgroundColor,
  color: props.content.textColor,
  borderColor: props.content.textColor,
}));

const trackStyle = computed(() => ({
  animationDuration: `${Math.max(props.content.speed, 1)}s`,
}));
</script>

<style scoped>
.retro-marquee__track {
  display: inline-flex;
  white-space: nowrap;
  animation: retro-marquee-scroll linear infinite;
  gap: 4rem;
  font-family: 'Comic Sans MS', 'Comic Sans', cursive;
  font-weight: 700;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
}

.retro-marquee__text {
  display: inline-block;
  padding-inline: 2rem;
}

@keyframes retro-marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
