<template>
  <div class="google-maps-consent block w-full" data-testid="google-maps-consent">
    <div class="google-maps-consent__frame relative w-full overflow-hidden" :style="aspectRatioStyle">
      <template v-if="!hasConsented">
        <img
          :src="previewImageSrc"
          alt=""
          class="google-maps-consent__preview absolute inset-0 block h-full w-full object-cover object-center"
          width="600"
          height="450"
          loading="lazy"
          data-testid="google-maps-consent-preview"
        />
        <div class="absolute inset-0 bg-black/70" aria-hidden="true" />
        <div
          class="google-maps-consent__overlay absolute inset-0 z-10 flex cursor-pointer items-center justify-center overflow-hidden p-4 sm:p-6"
          @click="grantConsent"
        >
          <div
            class="google-maps-consent__content flex w-full max-w-[92%] flex-col items-center text-center text-white sm:max-w-[540px]"
          >
            <p class="google-maps-consent__message m-0 w-full">
              {{ googleMapsConsentCopy.message }}
            </p>
            <p class="google-maps-consent__cta m-0 mt-4 flex w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-2">
              <span>Mit Klick auf</span>
              <UiButton
                type="button"
                variant="primary"
                class="google-maps-consent__button shrink-0"
                data-testid="google-maps-consent-button"
                @click.stop="grantConsent"
              >
                {{ googleMapsConsentCopy.loadButton }}
              </UiButton>
              <span>willigen Sie in die Datenübertragung an Google ein.</span>
            </p>
          </div>
        </div>
      </template>

      <iframe
        v-else
        :src="embedUrl"
        :title="iframeTitle"
        class="absolute inset-0 size-full border-0"
        width="600"
        height="450"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        data-testid="google-maps-iframe"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { googleMapsConsentCopy, getGoogleMapsPreviewUrl } from '~/configuration/googleMapsConsent.config';

const props = withDefaults(
  defineProps<{
    embedUrl: string;
    previewUrl?: string;
    width?: string;
    height?: string;
    iframeTitle?: string;
  }>(),
  {
    iframeTitle: 'Google Maps',
    width: '600',
    height: '450',
  },
);

const STORAGE_KEY = 'google-maps-consent-granted';

const hasConsented = ref(false);

const parseDimension = (value: string | undefined, fallback: number) => {
  const numeric = Number.parseFloat((value ?? '').replace(/px$/i, ''));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
};

const aspectRatioStyle = computed(() => {
  const width = parseDimension(props.width, 600);
  const height = parseDimension(props.height, 450);
  return { aspectRatio: `${width} / ${height}` };
});

const previewImageSrc = computed(
  () => getGoogleMapsPreviewUrl(props.embedUrl, props.previewUrl) ?? '/_nuxt-plenty/images/google-map-kontakt.jpg',
);

const grantConsent = () => {
  hasConsented.value = true;
  if (import.meta.client) {
    sessionStorage.setItem(STORAGE_KEY, '1');
  }
};

onMounted(() => {
  if (import.meta.client && sessionStorage.getItem(STORAGE_KEY) === '1') {
    hasConsented.value = true;
  }
});
</script>

<style scoped>
@media (min-width: 1024px) {
  .google-maps-consent {
    width: 100%;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
}

.google-maps-consent__frame {
  container-type: inline-size;
  container-name: google-maps-consent;
  width: 100%;
  max-width: 100%;
}

.google-maps-consent__preview {
  margin: 0;
  padding: 0;
}

.google-maps-consent__content {
  -webkit-font-smoothing: antialiased;
}

.google-maps-consent__message,
.google-maps-consent__cta {
  font-size: clamp(0.875rem, 3.4cqi, 1rem);
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  text-shadow: 0 1px 3px rgb(0 0 0 / 80%);
}

.google-maps-consent__cta {
  font-size: clamp(0.8125rem, 3cqi, 0.9375rem);
}

.google-maps-consent__button {
  border-radius: 9999px !important;
  background-color: #c4a035 !important;
  color: #fff !important;
  font-size: clamp(0.8125rem, 2.8cqi, 0.9375rem) !important;
  font-weight: 800 !important;
  line-height: 1.25 !important;
  padding: 0.5rem 1.25rem !important;
  box-shadow: none !important;
}

.google-maps-consent__button:hover {
  background-color: #b08f2e !important;
}

.google-maps-consent__button:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

@container google-maps-consent (min-width: 480px) {
  .google-maps-consent__message {
    font-size: 1rem;
    line-height: 1.55;
  }

  .google-maps-consent__cta {
    font-size: 0.9375rem;
    margin-top: 1.25rem;
  }

  .google-maps-consent__button {
    font-size: 0.9375rem !important;
    padding: 0.5625rem 1.375rem !important;
  }
}
</style>
