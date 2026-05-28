<template>
  <section class="w-full py-6 md:py-8">
    <div class="mx-auto max-w-screen-3xl px-4 md:px-6 lg:px-10">
      <div class="flex items-center justify-center">
        <h2 class="text-center text-xl font-semibold tracking-wide text-neutral-900 md:text-2xl">
          Kundenrezensionen
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
                class="home-reviews__card rounded border border-neutral-200 bg-white px-6 py-7 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
              >
                <div class="flex items-start gap-4">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                    :style="{ backgroundColor: review.avatar.bg, color: review.avatar.text }"
                    aria-hidden="true"
                  >
                    {{ review.initials }}
                  </div>

                  <div class="min-w-0">
                    <div class="flex items-center gap-3">
                      <div class="min-w-0 truncate text-sm font-semibold text-neutral-900">
                        {{ review.name }}
                      </div>
                      <div class="flex-1" />
                      <div class="ml-auto shrink-0 text-right text-xs text-neutral-500">
                        {{ review.when }}
                      </div>
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
type Review = {
  id: string;
  name: string;
  initials: string;
  when: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  avatar: {
    bg: string;
    text: string;
  };
};

const viewport = useViewport();

const reviews = ref<Review[]>([
  {
    id: 'w-henneboh',
    name: 'Wolfgang Henneboh',
    initials: 'W',
    when: 'vor 2 Jahren',
    rating: 5,
    text: 'Ich habe dort eine Hantelbank gekauft (über Ebay), diese Qualität hatte ich vermutlich nirgends gefunden und wenn, dann für sehr viel Geld. Alle Mitarbeiter dort waren sehr freundlich und hilfsbereit. Fazit: Ja Verkäufer, das gilt für alle dort.',
    avatar: { bg: '#6D28D9', text: '#FFFFFF' },
  },
  {
    id: 't-dressler',
    name: 'Tim Dressler',
    initials: 'T',
    when: 'vor einem Jahr',
    rating: 5,
    text: 'Ich bin absolut begeistert von meinem Kauf der Kühlkammer bei der Firma Komplett Konzept. Die Kontaktaufnahme war äußerst unkompliziert und professionell. Das Team hat sich Zeit genommen, um alle meine Fragen zu beantworten und mir bei der Auswahl des richtigen Produkts zu helfen. Die Abwicklung war tadellos – alles wurde schnell und zuverlässig organisiert. Auch die Lieferung verlief ohne Probleme und innerhalb des angekündigten Zeitrahmens. Ich kann die Firma nur wärmstens empfehlen und werde bei Bedarf gerne wieder auf sie zurückkommen. Vielen Dank für den hervorragenden Service!',
    avatar: { bg: '#64748B', text: '#FFFFFF' },
  },
  {
    id: 'a-schneider',
    name: 'André Schneider',
    initials: 'A',
    when: 'vor einem Jahr',
    rating: 5,
    text: 'Das Team von Komplett Konzept hat uns an einem Sonntag unkompliziert und super schnell geholfen. Die Beratung war professionell und der Transport nach Rotterdam wurde auch am selben Tag schnellstens durchgeführt. Die Ware entsprach zu 100 Prozent der Beschreibung!',
    avatar: { bg: '#16A34A', text: '#FFFFFF' },
  },
  {
    id: 'asap-jr',
    name: 'Asap Jr',
    initials: 'A',
    when: '2 years ago',
    rating: 5,
    text: 'Kompetente Mitarbeiter und sehr guter Service. Komplett Konzept ist seit Jahren mein Ansprechpartner Nummer 1 für SPS-Steuerungen, nur weiter zu empfehlen.',
    avatar: { bg: '#7C3AED', text: '#FFFFFF' },
  },
  {
    id: 't-s',
    name: 'T. S.',
    initials: 'T',
    when: '9 years ago',
    rating: 5,
    text: 'Uneingeschränkt zu empfehlen! Solche Abwicklungen wünscht man sich von einem auf Zukunft eingestellten und innovativem Unternehmen! Transaktionen pünktlich. Netter Kontakt. Ich werde immer mal wieder reinschauen. D.A.N.K.E.!!',
    avatar: { bg: '#64748B', text: '#FFFFFF' },
  },
  {
    id: 'carsten-baur',
    name: 'Carsten Baur',
    initials: 'C',
    when: '6 years ago',
    rating: 5,
    text: 'Ihr freundlicher, professioneller Partner für Alles rund um den Industriebedarf. Komplett Konzept - Ganz oder Gar nicht 💪 …',
    avatar: { bg: '#16A34A', text: '#FFFFFF' },
  },
]);

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

type TrackReview = Review & { _trackKey: string };
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
