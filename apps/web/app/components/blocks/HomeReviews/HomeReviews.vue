<template>
  <section class="w-full py-6 md:py-8">
    <div class="mx-auto max-w-screen-3xl px-4 md:px-6 lg:px-10">
      <div class="flex items-center justify-center">
        <h2 class="text-center text-xl font-semibold tracking-wide text-neutral-900 md:text-2xl">
          {{ sectionTitle }}
        </h2>
      </div>

      <div class="mt-5 md:mt-6">
        <div class="relative">
          <div
            ref="viewportRef"
            class="home-reviews__viewport overflow-hidden"
            :aria-label="`Reviews carousel, showing ${visibleCount} at a time`"
          >
            <div
              class="home-reviews__track flex gap-6"
              :class="[{ 'home-reviews__track--instant': isInstant }]"
              :style="trackStyle"
              @transitionend="onTrackTransitionEnd"
            >
              <article
                v-for="review in trackReviews"
                :key="review._trackKey"
                class="home-reviews__card relative overflow-hidden rounded border border-neutral-200 bg-white px-6 py-6 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
              >
                <div class="mb-5 flex items-center justify-between gap-3">
                  <div class="flex min-w-0 items-center gap-3">
                    <img
                      :src="reviewSourceMeta[review.source].logo"
                      :alt="reviewSourceMeta[review.source].label"
                      :class="[
                        'shrink-0 object-contain',
                        review.source === 'ebay' ? 'h-8 w-auto max-w-[4.5rem] sm:h-9 sm:max-w-[5rem]' : 'h-8 w-8 sm:h-9 sm:w-9',
                      ]"
                      width="36"
                      height="36"
                      loading="lazy"
                    />
                    <span class="truncate text-sm font-medium text-neutral-800 sm:text-base">
                      {{ reviewSourceMeta[review.source].label }}
                    </span>
                  </div>
                  <time class="shrink-0 text-xs text-neutral-500 sm:text-sm">{{ displayWhen(review) }}</time>
                </div>

                <div class="flex items-start gap-4">
                  <div
                    class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold sm:h-[3.375rem] sm:w-[3.375rem] sm:text-base"
                    :style="{ backgroundColor: review.avatar.bg, color: review.avatar.text }"
                    aria-hidden="true"
                  >
                    {{ review.initials }}
                  </div>

                  <div class="min-w-0 flex-1">
                    <div class="truncate text-sm font-semibold text-neutral-900">
                      {{ review.name }}
                    </div>
                    <div class="mt-1 flex items-center gap-1" :aria-label="`${review.rating} out of 5`">
                      <span v-for="n in 5" :key="n" class="text-[13px] leading-none" aria-hidden="true">
                        <span
                          class="font-black"
                          :class="n <= review.rating ? 'text-yellow-400' : 'text-neutral-200'"
                        >★</span>
                      </span>
                    </div>
                  </div>
                </div>

                <p class="mt-4 text-sm leading-relaxed text-neutral-700">
                  {{ review.text }}
                </p>
              </article>
            </div>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition active:scale-95"
            :class="buttonClass('prev')"
            aria-label="Previous reviews"
            @click="prev"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition active:scale-95"
            :class="buttonClass('next')"
            aria-label="Next reviews"
            @click="next"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { HomeReviewsProps } from './types';
import { resolveReviews, reviewSourceMeta, type NormalizedReview } from './utils';

const props = defineProps<HomeReviewsProps>();

const viewport = useViewport();

const sectionTitle = computed(() => props.content?.title?.trim() || 'Kundenrezensionen');

const reviews = computed<NormalizedReview[]>(() => resolveReviews(props.content?.reviews));

const whenOptions = ['vor 3 Jahren', 'vor einem Jahr', 'vor 6 Monaten'] as const;
const displayWhen = (review: NormalizedReview) => {
  if (review.when) return review.when;
  // Deterministic "random" pick per review id (SSR-safe).
  const hash = Array.from(review.id).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return whenOptions[hash % whenOptions.length];
};

const visibleCount = computed(() => {
  if (viewport.isLessThan('md')) return 1;
  if (viewport.isLessThan('lg')) return 2;
  return 3;
});

const viewportRef = ref<HTMLElement | null>(null);
const stepPx = ref(0);
const isInstant = ref(false);
const isAnimating = ref(false);
const pendingDelta = ref(0);
let animFallbackTimer: number | undefined;

type TrackReview = NormalizedReview & { _trackKey: string };
const clonesCount = computed(() => Math.min(visibleCount.value, reviews.value.length));
const trackReviews = computed<TrackReview[]>(() => {
  const items = reviews.value;
  const n = items.length;
  const c = clonesCount.value;
  if (!n) return [];

  const head = items.slice(0, c);
  const tail = items.slice(-c);
  const list = [...tail, ...items, ...head];
  return list.map((r, idx) => ({ ...r, _trackKey: `${r.id}-${idx}` }));
});

const index = ref(0);
const setStartIndex = () => {
  index.value = clonesCount.value; // start in the "real" list region
};

const measureStep = () => {
  const el = viewportRef.value;
  if (!el) return;
  const count = Math.max(1, clonesCount.value);
  const gap = 24; // gap-6
  const totalGap = gap * Math.max(0, count - 1);
  const cardWidth = (el.clientWidth - totalGap) / count;
  stepPx.value = cardWidth + gap;
};

const trackStyle = computed(() => {
  const x = -(index.value * stepPx.value);
  return {
    transform: `translate3d(${x}px, 0, 0)`,
  };
});

const clearAnimFallback = () => {
  if (animFallbackTimer) window.clearTimeout(animFallbackTimer);
  animFallbackTimer = undefined;
};

let clickTimer: number | undefined;
const lastClicked = ref<'prev' | 'next' | null>(null);

const flashClicked = (dir: 'prev' | 'next') => {
  lastClicked.value = dir;
  if (clickTimer) window.clearTimeout(clickTimer);
  clickTimer = window.setTimeout(() => {
    lastClicked.value = null;
  }, 180);
};

const buttonClass = (dir: 'prev' | 'next') => {
  const isActive = lastClicked.value === dir;
  return [
    'border-neutral-300 text-neutral-700 hover:border-neutral-600 hover:bg-neutral-200 hover:text-neutral-900 active:border-neutral-700 active:bg-neutral-300 active:text-neutral-900',
    isActive ? 'border-blue-700 bg-blue-100 text-blue-900' : '',
  ];
};

const scheduleFallbackEnd = () => {
  clearAnimFallback();
  // Slightly longer than CSS transition (360ms) so we don't race it.
  animFallbackTimer = window.setTimeout(() => {
    onTrackTransitionEnd();
  }, 520);
};

const startMove = (delta: number) => {
  if (!stepPx.value) {
    // Not measured yet; don't lock.
    isAnimating.value = false;
    pendingDelta.value = 0;
    return;
  }

  isAnimating.value = true;
  index.value += delta;
  scheduleFallbackEnd();
};

const go = (dir: 'prev' | 'next') => {
  const delta = dir === 'next' ? 1 : -1;
  if (isAnimating.value) {
    pendingDelta.value += delta;
    return;
  }
  startMove(delta);
};

const next = () => {
  flashClicked('next');
  go('next');
};
const prev = () => {
  flashClicked('prev');
  go('prev');
};

const onTrackTransitionEnd = () => {
  clearAnimFallback();
  const n = reviews.value.length;
  const c = clonesCount.value;
  if (!n || !c) {
    isAnimating.value = false;
    return;
  }

  // If we reached clones, snap back (instantly) into the real range.
  if (index.value === 0) {
    // We are at the "tail clones" region. Jump to the equivalent real position.
    isInstant.value = true;
    index.value = n;
  } else if (index.value === n + c) {
    // We are at the "head clones" region. Jump to the equivalent real position.
    isInstant.value = true;
    index.value = c;
  }

  // allow another click
  isAnimating.value = false;

  // Remove instant mode *after* the browser applied the snapped transform.
  // Two rAFs prevents occasional "reverse animation" flashes in some browsers.
  if (isInstant.value) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isInstant.value = false;
      });
    });
  }

  // Drain queued clicks (one step at a time to keep animation smooth).
  if (pendingDelta.value !== 0) {
    const delta = pendingDelta.value > 0 ? 1 : -1;
    pendingDelta.value -= delta;
    // start next movement on next frame to ensure transition re-applies
    requestAnimationFrame(() => startMove(delta));
  }
};

onMounted(() => {
  setStartIndex();
  measureStep();
  window.addEventListener('resize', measureStep, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', measureStep);
  if (clickTimer) window.clearTimeout(clickTimer);
  clearAnimFallback();
});

watch(visibleCount, async () => {
  await nextTick();
  setStartIndex();
  measureStep();
});

watch(
  () => reviews.value.map((r) => `${r.id}:${r.text}`).join('|'),
  async () => {
    await nextTick();
    setStartIndex();
    measureStep();
  },
);
</script>

<style scoped>
.home-reviews__track {
  will-change: transform;
  transition: transform 360ms ease;
}

.home-reviews__track--instant {
  transition: none;
}

.home-reviews__card {
  flex: 0 0 100%;
}

@media (min-width: 768px) {
  .home-reviews__card {
    flex-basis: calc((100% - 24px) / 2);
  }
}

@media (min-width: 1024px) {
  .home-reviews__card {
    flex-basis: calc((100% - 48px) / 3);
  }
}
</style>
