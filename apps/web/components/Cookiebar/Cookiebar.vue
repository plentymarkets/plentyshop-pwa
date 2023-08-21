<template>
  <client-only>
    <div
      v-if="!hideBanner"
      class="fixed font-sf-xl z-50 w-full xl:w-3/5 xl:right-2 bottom-0 xl:bottom-2 shadow-2xl p-10 bg-white"
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
        <div
          v-if="cookieJson"
          class="flex flex-col md:flex-row flex-wrap md:flex-nowrap ml-sf-xs justify-between items-center"
        >
          <div v-for="(cookieGroup, index) in cookieJson" :key="index" class="mr-sf-sm flex items-center">
            <SfCheckbox
              :id="cookieGroup.name"
              v-model="cookieGroup.accepted"
              :value="cookieGroup.accepted"
              :disabled="index === defaultCheckboxIndex"
              @change="setChildrenCheckboxes(cookieGroup, $event)"
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
      <div v-else class="overflow-y-auto h-80 px-2 pb-2">
        <div v-for="(cookieGroup, groupIndex) in cookieJson" :key="groupIndex" class="mb-2 p-2">
          <div>
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
              <div v-for="(cookie, cookieIndex) in cookieGroup.cookies" :key="cookieIndex" class="mb-5">
                <div class="flex w-full items-center">
                  <SfCheckbox
                    :id="cookie.name"
                    v-model="cookie.accepted"
                    :disabled="groupIndex === defaultCheckboxIndex"
                    @update:model-value="updateParentCheckbox(cookieGroup)"
                  />
                  <label
                    class="ml-3 text-base text-gray-900 cursor-pointer font-body peer-disabled:text-disabled-900"
                    :for="cookieGroup.name"
                  >
                    {{ cookie.name }}
                  </label>
                </div>
                <div v-for="propKey in Object.keys(cookie)" :key="propKey">
                  <div v-if="propKey !== 'name' && propKey !== 'accepted'" class="flex w-full mb-2 p-2 bg-white">
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
              type="button"
              size="sm"
              variant="secondary"
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
      <div class="my-2 text-center">
        <SfButton v-if="!furtherSettingsOn" type="button" variant="secondary" @click="furtherSettingsOn = true">
          {{ $t('CookieBar.Further Settings') }}
        </SfButton>
        <SfButton v-else type="button" variant="secondary" @click="furtherSettingsOn = false">
          {{ $t('CookieBar.Back') }}
        </SfButton>
      </div>
      <!-- action buttons -->
      <div class="w-full flex flex-col xl:flex-row mt-5 gap-2">
        <div class="flex-1 mb-2">
          <SfButton
            class="w-full"
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
            class="w-full"
            :aria-disabled="false"
            type="button"
            aria-label="button"
            @click="convertAndSaveCookies(true, false)"
          >
            {{ $t('CookieBar.Reject All') }}
          </SfButton>
        </div>
        <div class="flex-1 mb-sf-xs">
          <SfButton class="w-full" :aria-disabled="false" type="button" @click="convertAndSaveCookies(false, false)">
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
import { Cookie, CookieGroup } from 'cookie.config';

const runtimeConfig = useRuntimeConfig();
const { cookieJson, bannerIsHidden, convertAndSaveCookies, setHiddenState, defaultCheckboxIndex } = useCookieBar(
  useCookie('consent-cookie'),
  0,
  runtimeConfig.public.cookieGroups as any,
);

const hideBanner = computed(() => {
  return bannerIsHidden.value;
});
const furtherSettingsOn = ref(false);
const cookieGroups = ref(runtimeConfig.public.cookieGroups);

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
