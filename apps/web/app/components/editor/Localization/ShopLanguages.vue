<template>
  <div class="flex flex-col font-body">
    <div class="flex">
      <label class="pb-1 text-sm font-medium text-neutral-900">{{ getEditorTranslation('default-language') }}</label>
      <SfTooltip :label="getEditorTranslation('tooltip')" placement="right" :show-arrow="true" class="flex ml-3 z-20">
        <SfIconHelp size="sm" class="cursor-pointer" />
      </SfTooltip>
    </div>
    <SfSelect v-model="selectedDefaultLanguage" size="sm" placeholder="-- Select --">
      <option v-for="lang in selectedLanguageList" :key="lang.locale" :value="lang.locale">
        {{ lang.name }}
      </option>
    </SfSelect>
  </div>
  <div class="my-4 border-t-2 flex-grow" />
  <div class="typography-label-sm font-medium">{{ getEditorTranslation('description') }}</div>
  <EditorLocalizationActiveLanguageSwitch
    v-for="(lang, index) in allLanguagesArray"
    :key="index"
    :locale="lang.locale"
    :lang="lang.name"
    :selected="selectedLanguageList.some((list) => list.locale === lang.locale)"
    @update:selected="updateLanguageSwitch(lang.locale, $event)"
  />
</template>

<script setup lang="ts">
import { SfSelect, SfIconHelp, SfTooltip } from '@storefront-ui/vue';

const { allLanguages } = useEditorLocalizationLocales();
const { getSetting, updateSetting } = useSiteSettings('defaultLanguage');
const { getSetting: getList } = useSiteSettings('languageList');
const allLanguagesArray = Object.entries(allLanguages).map(([locale, name]) => ({ locale, name }));
const WarningAtLeastOneMessage = getEditorTranslation('warning-at-least-one');
const WarningDefaultChangedMessage = getEditorTranslation('warning-default-changed');

const selectedDefaultLanguage = ref(getSetting());
const allActiveLanguages = ref(
  getList()
    .split(',')
    .filter((lang: string) => lang && allLanguagesArray.some((l) => l.locale === lang)),
);

const selectedLanguages = computed(() => allActiveLanguages.value.map((lang: string) => lang.trim()));
const selectedLanguageList = computed(() =>
  allLanguagesArray.filter((lang) => selectedLanguages.value.includes(lang.locale)),
);

const updateLanguageSwitch = async (locale: string, isSelected: boolean) => {
  if (isSelected) {
    if (!allActiveLanguages.value.includes(locale)) {
      allActiveLanguages.value.push(locale);
    }
  } else {
    allActiveLanguages.value = allActiveLanguages.value.filter((lang: string) => lang !== locale);
  }

  if (allActiveLanguages.value.length === 0) {
    await nextTick();
    allActiveLanguages.value.push(locale);
    useNotification().send({
      type: 'warning',
      message: WarningAtLeastOneMessage,
    });
  }

  if (allActiveLanguages.value.indexOf(selectedDefaultLanguage.value) === -1) {
    selectedDefaultLanguage.value = allActiveLanguages.value[0]!;
    useNotification().send({
      type: 'warning',
      message: WarningDefaultChangedMessage,
    });
  }

  const updatedList = allActiveLanguages.value.join(',');
  useSiteSettings('languageList').updateSetting(updatedList);
};

watch(selectedDefaultLanguage, (newValue) => {
  updateSetting(newValue);
});
</script>

<i18n lang="json">
{
  "en": {
    "default-language": "Default language",
    "tooltip": "Select the language that will be displayed to customers in the shop by default.",
    "description": "Activate languages to make them available for selection in your Shop. Note that you also need to set up categories, items and translations for localization for the activated languages.",
    "warning-at-least-one": "At least one language must be active.",
    "warning-default-changed": "You deactivated the default language. The default language has been changed automatically."
  },
  "de": {
    "default-language": "Default language",
    "tooltip": "Select the language that will be displayed to customers in the shop by default.",
    "description": "Activate languages to make them available for selection in your Shop. Note that you also need to set up categories, items and translations for localization for the activated languages.",
    "warning-at-least-one": "At least one language must be active.",
    "warning-default-changed": "You deactivated the default language. The default language has been changed automatically."
  }
}
</i18n>
