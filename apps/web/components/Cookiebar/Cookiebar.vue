<template>
  <client-only>
    <div
      v-if="!bannerIsHidden"
      class="fixed font-sf-xl z-50 w-full xl:w-3/5 text-sf-c-text font-sf-secondary font-sf-medium xl:right-sf-sm bottom-0 xl:bottom-sf-sm bg-sf-c-light-lighten shadow-2xl p-10 bg-white"
    >
      <div v-if="!furtherSettingsOn">
        <!-- cookie info -->
        <div
          class="text-left md:text-center ml-sf-xs md:ml-0 non-italic font-sf-semibold pt-sf-xs text-sf-xl text-sf-c-primary"
        >
          {{ cookieGroups?.barTitle }}
        </div>
        <div class="non-italic font-sf-normal text-sf-xs md:text-sf-sm leading-relaxed p-2 pb-5">
          {{ cookieGroups.barDescription }}

          <SfLink href="/PrivacyPolicy" class="sf-button--text">
            {{ $t('CookieBar.Privacy Settings') }}
          </SfLink>
        </div>
        <!-- checkboxes -->
        <div v-if="cookieJson" class="flex flex-col md:flex-row flex-wrap md:flex-nowrap ml-sf-xs justify-between items-center">
          <div v-for="(cookieGroup, index) in cookieJson" :key="index" class="mr-sf-sm">
            <SfCheckbox
              id="checkbox"
              v-model="cookieGroup.accepted"
              :value="cookieGroup.accepted"
              :disabled="index === defaultCheckboxIndex"
              @change="setChildrenCheckboxes(cookieGroup, $event)"
            />
            <label class="ml-3 text-base text-gray-900 cursor-pointer font-body peer-disabled:text-disabled-900" for="checkbox">
            {{ cookieGroup.name }}
            </label>
          </div>
        </div>
      </div>
      <div v-else class="overflow-y-auto h-80 bg-sf-c-light-primary-lighten px-2 pb-2">
        <div
          v-for="(cookieGroup, groupIndex) in cookieJson"
          :key="groupIndex"
          class="bg-sf-c-light-primary mb-sf-xs p-sf-xs"
        >
          <div>
            <SfCheckbox
              v-model="cookieGroup.accepted"
              :disabled="groupIndex === defaultCheckboxIndex"
              :name="cookieGroup.name"
              :label="cookieGroup.name"
              @update:modelValue="setChildrenCheckboxes(cookieGroup, $event)"
            />
            <div class="non-italic text-sf-normal text-sf-sm leading-6 my-2">
              {{ cookieGroup.description }}
            </div>
            <div v-if="cookieGroup.showMore ?? false" class="font-sf-light2">
              <div
                v-for="(cookie, cookieIndex) in cookieGroup.cookies"
                :key="cookieIndex"
                class="mb-5"
              >
                <div class="flex w-full mb-sf-2xs p-sf-xs bg-white">
                  <SfCheckbox
                    v-model="cookie.accepted"
                    :disabled="groupIndex === defaultCheckboxIndex"
                    :name="cookie.name"
                    :label="cookie.name"
                    @update:modelValue="updateParentCheckbox(cookieGroup)"
                  />
                </div>
                <div v-for="propKey in Object.keys(cookie)" :key="propKey">
                  <div
                    v-if="propKey !== 'name' && propKey !== 'accepted'"
                    class="flex w-full mb-sf-2xs p-sf-xs bg-white"
                  >
                    <div class="w-1/4">
                      {{ propKey }}
                    </div>
                    <div class="w-3/4">
                      <template v-if="propKey === 'Privacy policy'">
                        <!-- TODO -->
                        <SfLink :link="cookie.name">
                          {{ $t('CookieBar.Privacy Settings') }}
                        </SfLink>
                      </template>
                      <template v-else>
                        <!-- TODO -->
                        {{ cookie.name }}
                      </template>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <SfButton
              v-if="!cookieGroup.showMore ?? false"
              type="button" size="sm" variant="secondary"
              @click="cookieGroup.showMore = true"
            >
              {{ $t('CookieBar.More information') }}
            </SfButton>
            <SfButton v-else type="button" size="sm" @click="cookieGroup.showMore = false">
              {{ $t('CookieBar.Show less') }}
            </SfButton>
          </div>
        </div>
      </div>
      <!-- further settings / back button -->
      <div class="my-sf-sm text-center">
        <SfButton v-if="!furtherSettingsOn" type="button" variant="secondary" @click="furtherSettingsOn = true">
          {{ $t('CookieBar.Further Settings') }}
        </SfButton>
        <SfButton v-else type="button" variant="secondary" @click="furtherSettingsOn = false">
          {{ $t('CookieBar.Back') }}
        </SfButton>
      </div>
      <!-- action buttons -->
      <div class="w-full flex flex-col xl:flex-row mt-5 gap-2">
        <div class="flex-1 mb-sf-xs">

          <SfButton
            v-e2e="'accept-all'"
            class="color-sf-c-primary w-full sf-button"
            :aria-disabled="false"
            type="button"
            aria-label="button"
            @click="convertAndSaveCookies(true, true)"
          >
            {{ $t('CookieBar.Accept All') }}
          </SfButton>
        </div>
        <div class="flex-1 mb-sf-xs">
          <SfButton
            v-e2e="'reject-all'"
            class="color-sf-c-primary w-full sf-button"
            :aria-disabled="false"
            type="button"
            aria-label="button"
            @click="convertAndSaveCookies(true, false)"
          >
            {{ $t('CookieBar.Reject All') }}
          </SfButton>
        </div>
        <div class="flex-1 mb-sf-xs">
          <SfButton
            v-e2e="'accept-selection'"
            class="sf-button w-full border-solid border-1 border-sf-c-primary"
            :aria-disabled="false"
            type="button"
            @click="convertAndSaveCookies(false, false)"
          >
            {{ $t('CookieBar.Accept Selection') }}
          </SfButton>
        </div>
      </div>
    </div>
    <!-- button to open cookie tab -->
    <button
      v-else
      v-e2e="'cookie-show-banner-button'"
      class="color-sf-c-primary sf-button z-10 fixed bottom-sf-2xl xl:bottom-sf-xs xl:left-auto xl:right-sf-xs invisible xl:visible"
      aria-label="Cookie control"
      @click="bannerIsHidden = false"
    >
      <SfIcon icon="info_shield" size="xs" color="white" viewBox="0 0 24 24" :coverage="1" />
    </button>
  </client-only>
</template>

<script setup lang="ts">
import { CookieGroup, Cookie } from '../../composables/useCookieBar/types';
import { SfLink, SfButton, SfCheckbox } from '@storefront-ui/vue';

const runtimeConfig = useRuntimeConfig();
const consentCookie = useCookie('consent-cookie');
console.log(consentCookie);
const { cookieJson, bannerIsHidden, convertAndSaveCookies, defaultCheckboxIndex } = useCookieBar(
  useCookie('consent-cookie'),
  'consent-cookie',
  0,
  runtimeConfig.public.cookieGroups,
);
const furtherSettingsOn = ref(false);
const cookieGroups = ref(runtimeConfig.public.cookieGroups)

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
