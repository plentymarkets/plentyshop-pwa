<template>
  <client-only>
    <div
      v-if="!hideBanner"
      class="fixed z-50 w-full xl:w-3/5 xl:right-2 bottom-0 xl:bottom-2 shadow-2xl p-3 bg-white rounded overflow-auto top-0 sm:top-auto"
    >
      <div v-if="!furtherSettingsOn">
        <!-- cookie info -->
        <div class="font-medium text-center">
          {{ cookieGroups?.barTitle }}
        </div>
        <div class="leading-relaxed pb-5">
          {{ cookieGroups.barDescription }}

          <SfLink :tag="NuxtLink" :to="localePath(paths.privacyPolicy)">
            {{ $t('CookieBar.Privacy Settings') }}
          </SfLink>
        </div>
        <!-- checkboxes -->
        <div v-if="cookieJson" class="flex flex-wrap justify-between">
          <div v-for="(cookieGroup, index) in cookieJson" :key="index" class="sm:mb-5 mb-2 pr-2 flex items-center">
            <SfCheckbox
              :id="cookieGroup.name"
              v-model="cookieGroup.accepted"
              :value="cookieGroup.accepted"
              :disabled="index === defaultCheckboxIndex"
              @update:model-value="setChildrenCheckboxes(cookieGroup, $event)"
            />
            <label class="ml-2 cursor-pointer peer-disabled:text-disabled-900" :for="cookieGroup.name">
              {{ cookieGroup.name }}
            </label>
          </div>
        </div>
      </div>
      <div v-else class="overflow-y-auto h-80 pb-2">
        <div v-for="(cookieGroup, groupIndex) in cookieJson" :key="groupIndex" class="mb-2 bg-gray-100 p-2">
          <SfCheckbox
            class="align-text-top"
            :id="cookieGroup.name"
            v-model="cookieGroup.accepted"
            :disabled="groupIndex === defaultCheckboxIndex"
            @update:model-value="setChildrenCheckboxes(cookieGroup, $event)"
          />
          <label
            class="ml-2 cursor-pointer peer-disabled:text-disabled-900 align-text-bottom font-medium"
            :for="cookieGroup.name"
          >
            {{ cookieGroup.name }}
          </label>
          <div class="leading-6 my-2">
            {{ cookieGroup.description }}
          </div>
          <div v-if="cookieGroup.showMore ?? false">
            <div v-for="(cookie, cookieIndex) in cookieGroup.cookies" :key="cookieIndex" class="mb-4">
              <div class="flex w-full items-center bg-white mb-1 p-2">
                <SfCheckbox
                  class="ml-1"
                  :id="cookie.name"
                  v-model="cookie.accepted"
                  :disabled="groupIndex === defaultCheckboxIndex"
                  @update:model-value="updateParentCheckbox(cookieGroup)"
                />
                <label class="ml-2 cursor-pointer peer-disabled:text-disabled-900 font-medium" :for="cookieGroup.name">
                  {{ cookie.name }}
                </label>
              </div>
              <div v-for="propKey in Object.keys(cookie)" :key="propKey">
                <div v-if="propKey !== 'name' && propKey !== 'accepted'" class="flex w-full mb-1 p-2 bg-white">
                  <div class="w-1/4">
                    {{ propKey }}
                  </div>
                  <div class="w-3/4">
                    <template v-if="propKey === 'PrivacyPolicy'">
                      <!-- TODO -->
                      <SfLink :tag="NuxtLink" :link="localePath(paths.privacyPolicy)">
                        {{ $t('CookieBar.Privacy Settings') }}
                      </SfLink>
                    </template>
                    <template v-else>
                      {{ cookie.name }}
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SfLink v-if="!cookieGroup.showMore ?? false" href="#" size="sm" @click="cookieGroup.showMore = true">
            {{ $t('CookieBar.More information') }}
          </SfLink>
          <SfLink v-else href="#" size="sm" @click="cookieGroup.showMore = false">
            {{ $t('CookieBar.Show less') }}
          </SfLink>
        </div>
      </div>
      <!-- further settings / back button -->
      <div class="text-center mt-2">
        <SfLink v-if="!furtherSettingsOn" href="#" @click="furtherSettingsOn = true">
          {{ $t('CookieBar.Further Settings') }}
        </SfLink>
        <SfLink v-else href="#" @click="furtherSettingsOn = false">
          {{ $t('CookieBar.Back') }}
        </SfLink>
      </div>
      <!-- action buttons -->
      <div class="w-full flex flex-col xl:flex-row mt-5 gap-2 mb-2">
        <div class="flex-1">
          <SfButton
            class="w-full"
            :aria-disabled="false"
            type="button"
            aria-label="button"
            @click="convertAndSave(true, true)"
          >
            {{ $t('CookieBar.Accept All') }}
          </SfButton>
        </div>
        <div class="flex-1">
          <SfButton
            class="w-full"
            :aria-disabled="false"
            type="button"
            aria-label="button"
            @click="convertAndSave(true, false)"
          >
            {{ $t('CookieBar.Reject All') }}
          </SfButton>
        </div>
        <div class="flex-1">
          <SfButton class="w-full" :aria-disabled="false" type="button" @click="convertAndSave(false, false)">
            {{ $t('CookieBar.Accept Selection') }}
          </SfButton>
        </div>
      </div>
    </div>
    <!-- button to open cookie tab -->
    <SfButton
      v-else
      variant="secondary"
      class="z-10 fixed bottom-2 xl:bottom-2 xl:left-auto xl:right-2 bg-white"
      aria-label="Cookie control"
      @click="setHiddenState(false)"
    >
      <SfIconCheckBox />
    </SfButton>
  </client-only>
</template>

<script setup lang="ts">
import { SfLink, SfButton, SfCheckbox, SfIconCheckBox } from '@storefront-ui/vue';
import { Cookie, CookieGroup, CookieGroupFromNuxtConfig } from 'cookie.config';

const NuxtLink = resolveComponent('NuxtLink');
const localePath = useLocalePath();
const runtimeConfig = useRuntimeConfig();
const cookieGroups = ref(runtimeConfig.public.cookieGroups);
const { getMinimumLifeSpan } = cookieBarHelper();
const { cookieJson, bannerIsHidden, convertAndSaveCookies, setHiddenState, defaultCheckboxIndex } = useCookieBar(
  useCookie('consent-cookie'),
  0,
  cookieGroups.value as CookieGroupFromNuxtConfig,
);
const convertAndSave = (setAllCookies: boolean, latestStatus: boolean) => {
  const consentCookie = useCookie('consent-cookie', {
    path: '/',
    maxAge: getMinimumLifeSpan(cookieJson),
  }) as any;
  consentCookie.value = convertAndSaveCookies(setAllCookies, latestStatus);
};
const hideBanner = computed(() => {
  return bannerIsHidden.value;
});
const furtherSettingsOn = ref(false);

const setChildrenCheckboxes = (group: CookieGroup, state: unknown) => {
  group.cookies = group.cookies.map((cookie) => ({
    ...cookie,
    accepted: state,
  })) as Cookie[];
};

const updateParentCheckbox = (group: CookieGroup) => {
  group.accepted = group.cookies.some((cookie) => cookie.accepted);
};
</script>
