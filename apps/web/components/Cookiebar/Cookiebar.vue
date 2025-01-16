<template>
  <div
    v-if="visible"
    class="fixed max-sm:flex max-sm:flex-col max-sm:justify-between z-50 w-full xl:w-3/5 xl:right-2 bottom-0 max-md:bottom-[3.9rem] shadow-2xl p-3 bg-white rounded overflow-auto end-0 sm:top-auto"
  >
    <div v-if="!furtherSettingsOn">
      <!-- cookie info -->
      <div class="text-center font-medium">
        {{ t(cookieGroups?.barTitle) }}
      </div>
      <div class="max-h-[35vh] leading-relaxed overflow-y-auto">
        {{ t(cookieGroups?.barDescription) }}
        <SfLink :tag="NuxtLink" :to="privacyPolicy">{{ t('CookieBar.Privacy Settings') }}</SfLink>
      </div>
      <!-- checkboxes -->
      <div v-if="cookieJson" class="flex flex-wrap gap-4 sm:grid sm:grid-cols-4 mt-2">
        <template v-for="(cookieGroup, index) in cookieJson.groups" :key="index">
          <div v-if="cookieGroup?.cookies?.length" class="flex items-center space-x-2">
            <SfCheckbox
              :id="cookieGroup.name"
              v-model="cookieGroup.accepted"
              :disabled="index === defaults.ESSENTIAL_COOKIES_INDEX"
              @update:model-value="triggerGroupConsent(cookieGroup)"
            />
            <label :for="cookieGroup.name" class="text-gray-800 cursor-pointer peer-disabled:text-disabled-900">
              {{ t(cookieGroup.name) }}
            </label>
          </div>
        </template>
      </div>
    </div>

    <div v-else class="mt-2 max-h-[50vh] overflow-y-auto">
      <template v-for="(cookieGroup, groupIndex) in cookieJson.groups" :key="groupIndex">
        <div v-if="cookieGroup?.cookies?.length" class="p-2 mb-2 bg-gray-100">
          <SfCheckbox
            :id="cookieGroup.name"
            v-model="cookieGroup.accepted"
            class="align-text-top"
            :disabled="groupIndex === defaults.ESSENTIAL_COOKIES_INDEX"
            @update:model-value="triggerGroupConsent(cookieGroup)"
          />
          <label
            class="ml-2 cursor-pointer peer-disabled:text-disabled-900 align-text-bottom font-medium"
            :for="cookieGroup.name"
          >
            {{ t(cookieGroup.name) }}
          </label>
          <div class="leading-6 my-2">
            {{ t(cookieGroup.description) }}
          </div>
          <div v-if="Boolean(cookieGroup.showMore)">
            <div v-for="(cookie, cookieIndex) in cookieGroup.cookies" :key="cookieIndex" class="mb-4">
              <div class="flex items-center p-2 mb-1 bg-white">
                <SfCheckbox
                  :id="cookie.name"
                  v-model="cookie.accepted"
                  class="ml-1"
                  :disabled="groupIndex === defaults.ESSENTIAL_COOKIES_INDEX"
                  @update:model-value="triggerCookieConsent(cookieGroup)"
                />
                <label :for="cookie.name" class="ml-2 font-medium cursor-pointer peer-disabled:text-disabled-900">
                  {{ t(cookie.name) }}
                </label>
              </div>
              <div v-for="propKey in Object.keys(cookie)" :key="propKey">
                <div v-if="propKey !== 'name' && propKey !== 'accepted'" class="flex p-2 mb-1 bg-white">
                  <div class="w-1/4">
                    {{ t(`CookieBar.keys.${propKey}`) }}
                  </div>
                  <div class="w-3/4 break-words">
                    <template v-if="propKey === 'PrivacyPolicy'">
                      <SfLink :tag="NuxtLink" :to="privacyPolicy">{{ t('CookieBar.Privacy Settings') }}</SfLink>
                    </template>
                    <template v-else-if="getCookiePropertyValue(cookie, propKey)">
                      {{
                        getCookiePropertyValue(cookie, propKey).startsWith('CookieBar.')
                          ? t(getCookiePropertyValue(cookie, propKey))
                          : getCookiePropertyValue(cookie, propKey)
                      }}
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SfLink
            tag="button"
            size="sm"
            class="text-primary hover:underline"
            @click="cookieGroup.showMore = !cookieGroup.showMore"
          >
            {{ cookieGroup.showMore ? t('CookieBar.Show less') : t('CookieBar.More information') }}
          </SfLink>
        </div>
      </template>
    </div>

    <!-- Actions -->
    <div class="my-5 text-center">
      <SfLink tag="button" class="text-base" @click="furtherSettingsOn = !furtherSettingsOn">
        {{ furtherSettingsOn ? t('CookieBar.Back') : t('CookieBar.Further Settings') }}
      </SfLink>
    </div>
    <div class="flex flex-col gap-4 sm:flex-row">
      <UiButton
        class="w-full h-10 md:h-12"
        :aria-disabled="false"
        type="button"
        :aria-label="t('CookieBar.Accept All')"
        data-testid="cookie-bar-accept-all"
        @click="setAllCookiesState(true)"
      >
        {{ t('CookieBar.Accept All') }}
      </UiButton>
      <UiButton
        class="w-full h-10 md:h-12"
        :aria-disabled="false"
        type="button"
        :aria-label="t('CookieBar.Reject All')"
        @click="setAllCookiesState(false)"
      >
        {{ t('CookieBar.Reject All') }}
      </UiButton>
      <UiButton
        variant="secondary"
        class="w-full h-10 md:h-12"
        :aria-disabled="false"
        type="button"
        :aria-label="t('CookieBar.Accept Selection')"
        @click="setConsent()"
      >
        {{ t('CookieBar.Accept Selection') }}
      </UiButton>
    </div>
  </div>

  <!-- Button to Open Cookie Tab -->
  <div v-if="!visible" class="z-10 h-auto w-12 fixed bottom-[4.3rem] md:bottom-2 left-2 xl:left-auto xl:right-2">
    <SfTooltip :label="t('CookieBar.Cookie Settings')" placement="left">
      <UiButton
        variant="secondary"
        class="!px-3 bg-white"
        :aria-label="t('CookieBar.Cookie Settings')"
        data-testid="cookie-bar-open-btn"
        @click="changeVisibilityState"
      >
        <SfIconBase viewBox="0 0 24 24" size="base" class="fill-none">
          <path
            d="M9 16h.01M12 11h.01M7 10h.01M15 16h.01M21 12a9 9 0 1 1-9-9c0 2.761 1.79 5 4 5 0 2.21 2.239 4 5 4z"
            :style="{ stroke: 'rgb(var(--colors-2-primary-500) / 1)' }"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </SfIconBase>
      </UiButton>
    </SfTooltip>
  </div>
</template>

<script setup lang="ts">
import { SfLink, SfCheckbox, SfIconBase, SfTooltip } from '@storefront-ui/vue';
import { defaults } from '~/composables';
import type { Cookie, CookieGroup } from '~/configuration/cookie.config';

const NuxtLink = resolveComponent('NuxtLink');
const localePath = useLocalePath();
const runtimeConfig = useRuntimeConfig();
const cookieGroups = ref(runtimeConfig.public.cookieGroups);
const { t } = useI18n();

const {
  initializeCookies,
  data: cookieJson,
  visible,
  setConsent,
  setAllCookiesState,
  changeVisibilityState,
} = useReadCookieBar();

initializeCookies();

const furtherSettingsOn = ref(false);

const privacyPolicy = computed(() => localePath(paths.privacyPolicy));

const triggerCookieConsent = (group: CookieGroup) => {
  group.accepted = group.cookies.some((cookie: Cookie) => cookie.accepted);
};

const triggerGroupConsent = (group: CookieGroup) => {
  group.cookies.forEach((cookie: Cookie) => {
    cookie.accepted = group.accepted;
  });
};

const getCookiePropertyValue = (cookie: Cookie, propertyKey: string) => {
  return cookie[propertyKey as keyof Cookie]?.toString() || '';
};
</script>
