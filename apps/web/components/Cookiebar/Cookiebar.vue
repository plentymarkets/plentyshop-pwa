<template>
  <client-only>
    <div
      v-if="!hideBanner"
      class="fixed font-sf-xl z-50 w-full xl:w-3/5 xl:right-2 bottom-0 xl:bottom-2 shadow-2xl p-2 bg-white"
    >
      <div v-if="!furtherSettingsOn">
        <!-- cookie info -->
        <div
          class="text-left font-medium md:text-center ml-sf-xs md:ml-0 non-italic font-sf-semibold pt-sf-xs text-sf-xl text-sf-c-primary"
        >
          {{ cookieGroups?.barTitle }}
        </div>
        <div class="non-italic font-sf-normal text-sf-xs md:text-sf-xs leading-relaxed p-2 pb-5">
          {{ cookieGroups.barDescription }}

          <SfLink href="/PrivacyPolicy" class="sf-button--text">
            {{ $t('CookieBar.Privacy Settings') }}
          </SfLink>
        </div>
        <!-- checkboxes -->
        <div
          v-if="cookieJson"
          class="flex flex-col md:flex-row flex-wrap md:flex-nowrap ml-sf-xs justify-between items-center"
        >
          <div v-for="(cookieGroup, index) in cookieJson" :key="index" class="mr-sf-sm mb-5 flex items-center">
            <SfCheckbox
              :id="cookieGroup.name"
              v-model="cookieGroup.accepted"
              :value="cookieGroup.accepted"
              :disabled="index === defaultCheckboxIndex"
              @update:model-value="setChildrenCheckboxes(cookieGroup, $event)"
            />
            <label
              class="ml-3 text-base text-gray-900 cursor-pointer font-body peer-disabled:text-disabled-900"
              :for="cookieGroup.name"
            >
              {{ cookieGroup.name }}
            </label>
          </div>
        </div>
      </div>
      <div v-else class="overflow-y-auto h-80 pb-2">
        <div v-for="(cookieGroup, groupIndex) in cookieJson" :key="groupIndex" class="mb-2 bg-gray-100">
          <div class="px-2">
            <SfCheckbox
              :id="cookieGroup.name"
              v-model="cookieGroup.accepted"
              :disabled="groupIndex === defaultCheckboxIndex"
              @update:model-value="setChildrenCheckboxes(cookieGroup, $event)"
            />
            <label
              class="ml-3 text-base text-gray-900 cursor-pointer font-body peer-disabled:text-disabled-900"
              :for="cookieGroup.name"
            >
              {{ cookieGroup.name }}
            </label>
            <div class="non-italic leading-6 my-2">
              {{ cookieGroup.description }}
            </div>
            <div v-if="cookieGroup.showMore ?? false">
              <div v-for="(cookie, cookieIndex) in cookieGroup.cookies" :key="cookieIndex" class="mb-2">
                <div class="flex w-full items-center bg-white mb-2 pa-2">
                  <SfCheckbox
                    class="ml-1"
                    :id="cookie.name"
                    v-model="cookie.accepted"
                    :disabled="groupIndex === defaultCheckboxIndex"
                    @update:model-value="updateParentCheckbox(cookieGroup)"
                  />
                  <label
                    class="ml-3 mt-2 mb-2 text-base text-gray-900 cursor-pointer font-body peer-disabled:text-disabled-900"
                    :for="cookieGroup.name"
                  >
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
                        <SfLink :link="cookie.name">
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
          </div>
          <div class="ml-2">
            <SfLink
              v-if="!cookieGroup.showMore ?? false"
              size="sm"
              @click="cookieGroup.showMore = true"
              class="sf-button--text"
            >
              <div class="text-black-200">
                {{ $t('CookieBar.More information') }}
              </div>
            </SfLink>
            <SfLink v-else size="sm" @click="cookieGroup.showMore = false" class="sf-button--text text-gray-100">
              {{ $t('CookieBar.Show less') }}
            </SfLink>
          </div>
        </div>
      </div>
      <!-- further settings / back button -->
      <div class="my-2 text-center">
        <SfLink v-if="!furtherSettingsOn" @click="furtherSettingsOn = true" class="sf-button--text">
          {{ $t('CookieBar.Further Settings') }}
        </SfLink>
        <SfLink v-else @click="furtherSettingsOn = false" class="sf-button--text">
          {{ $t('CookieBar.Back') }}
        </SfLink>
      </div>
      <!-- action buttons -->
      <div class="w-full flex flex-col xl:flex-row mt-5 gap-2">
        <div class="flex-1 mb-2">
          <SfButton
            class="w-full text-red-600"
            :aria-disabled="false"
            type="button"
            aria-label="button"
            @click="convertAndSave(true, true)"
          >
            {{ $t('CookieBar.Accept All') }}
          </SfButton>
        </div>
        <div class="flex-1 mb-sf-xs">
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
        <div class="flex-1 mb-sf-xs">
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
      class="z-10 fixed bottom-2 xl:bottom-2 xl:left-auto xl:right-2"
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

const runtimeConfig = useRuntimeConfig();
const cookieGroups = ref(runtimeConfig.public.cookieGroups);
const { getMinimumLifeSpan } = cookieBarHelper();
const { cookieJson, bannerIsHidden, convertAndSaveCookies, setHiddenState, defaultCheckboxIndex } = useCookieBar(
  useCookie('consent-cookie'),
  0,
  cookieGroups.value as CookieGroupFromNuxtConfig,
);
const convertAndSave = (setAllCookies, latestStatus) => {
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
