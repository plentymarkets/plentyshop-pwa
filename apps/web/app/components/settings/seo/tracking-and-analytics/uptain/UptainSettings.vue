<template>
  <div
    class="space-y-4"
    style="background: #111111; color: #fff; height: 100%; margin-inline: -1rem; margin-block: -0.5em; padding: 1rem;"
  >
    <!-- Warning Message -->
    <div
      v-if="hasChanges"
      style="position: sticky; top: 1em; border: 1px solid rgba(251, 191, 36, 0.3); margin-bottom: 1.75em; padding: 1em; border-radius: 0.5em; background-color: rgb(76 54 0); z-index: 11;"
    >
      <p style="color: #fbbf24; font-size: 0.875rem; margin: 0;">
        ⚠️ {{ getEditorTranslation('redeployWarning') }}
      </p>
    </div>

    <!-- Uptain Logo -->
    <div
      class="w-full"
    >
      <div class="flex justify-between items-center mb-6">
        <svg class="logo--dark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140.71 50" style="width: 80px;">
          <path d="M31.06 9.63L22.54 0 14 9.63h5v17.28c0 4.49-1.56 6.45-6.06 6.48s-6-2-6-6.48V10.09C-.65 12.21-.09 19.9.08 26c-.69 13 14.07 17.55 22.46 9.92C28 31.34 25.42 16 26 9.63zm23.57 8.54c-1.58-5.54-6.57-8.44-11.84-8.33-6.94-.15-11.91 3.27-12.09 9.67V50c5.53-1.59 7.41-6.62 6.91-10.93C52 42.44 58.46 31 54.63 18.17zM47 32.23c-2.13 2.47-6 2.07-9.35 1.62v-15c-.49-3.7 8.37-4.22 9.79-.84C49.07 20.45 49.39 30 47 32.23z" fill="#31b9b5"></path>
          <path d="M63.74 35.81c1.95 3.88 6.8 4.27 10.44 3v-3.5c-1.77.78-5.29.87-6.5-.37-2-1.43-.58-18.83-1-21.11h7.48v-3.37H66.7V2.27h-3.79v8.19h-5v3.42h5c.28 3.21-.76 19.29.83 21.93zm35.46-.65c2.06-2.54 1-10.24 1.25-13.34.47-12-11.57-13.72-20.77-10.43V15c6-2 17.63-3 16.93 6.43-5.68-.4-12.64-.82-17.36 3-2.58 2.27-3.13 6.9-1.53 9.88 1.51 3.21 5.16 4.47 8.33 5 4.57.44 10.23 0 13.15-4.15zm-10.43.78c-5.34 0-8.18-1.86-8.16-5.62-.84-5.75 10.45-6.7 16-5.55.1 6.02 1.23 11.3-7.84 11.17zm17.77-25.48h3.79v28.56h-3.79zm-.23-9.75h4.24v4.24h-4.24zM133 14.3c2.76.94 3.76 3.43 3.76 6.05V39h3.79c-.69-5.54 2.14-22.55-2.95-26.35-5-4.48-14.63-2.78-20.4 0V39h3.8V14.92c3.91-1.13 8.36-1.77 12-.62z" fill="#fff"></path>
        </svg>
        <div class="flex" style="align-items: center; color: #4f4f4f; font-size: 90%;">
          <span>Version 1.0.0</span>
        </div>
      </div>
    </div>

    <!-- Enable/Disable Uptain -->
    <div style="position: relative; border: 1px solid rgb(238 238 238 / 20%); padding: 1em; border-radius: 0.5em;">
      <div class="flex justify-between">
        <div>
          <UiFormLabel class="mb-1">{{ getEditorTranslation('enableUptain.label') }}</UiFormLabel>
          <p class="text-sm text-neutral-500">{{ getEditorTranslation('enableUptain.description') }}</p>
        </div>
        <div style="position: relative;">
          <input
            v-model.number="uptainEnabled"
            type="number"
            min="0"
            max="1"
            style="position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0;"
          />
          <SfSwitch
            :model-value="uptainEnabled === 1"
            @update:model-value="uptainEnabled = $event ? 1 : 0"
            class="uptain-switch checked:bg-editor-button checked:before:hover:bg-editor-button hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300"
          />
        </div>
      </div>
    </div>

    <!-- Uptain ID -->
    <div style="position: relative; border: 1px solid rgb(238 238 238 / 20%); padding: 1em; border-radius: 0.5em;">
      <div
        style="position: absolute; top: 0; left: 0.5em; z-index: 1; transform: translateY(-50%); padding: 0 0.5em; background: #111; font-size: 0.875em; color: #696969;"
      >
        {{ getEditorTranslation('accountLabel') }}
      </div>
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('uptainId.label') }}</UiFormLabel>
        <SfTooltip :label="getEditorTranslation('uptainId.tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
          <SfIconInfo :size="'sm'" />
        </SfTooltip>
      </div>
      <label>
        <SfInput
          v-model="uptainId"
          type="text"
          data-testid="uptain-tracking-id"
          :placeholder="getEditorTranslation('uptainId.placeholder')"
        />
      </label>
    </div>

    <!-- Toggles -->
    <div style="position: relative;border: 1px solid rgb(238 238 238 / 20%); padding: 1em; border-radius: 0.5em;" class="space-y-4">
      <div
        style="position: absolute; top: 0; left: 0.5em; z-index: 1; transform: translateY(-50%); padding: 0 0.5em; background: #111; font-size: 0.875em; color: #696969;"
      >
        {{ getEditorTranslation('basicSettingsLabel') }}
      </div>
      <!-- Transmit personal data for newsletter subscribers -->
      <div class="flex justify-between">
        <UiFormLabel class="mb-1">{{ getEditorTranslation('transmitNewsletterData.label') }}</UiFormLabel>
        <div style="position: relative;">
          <input
            v-model.number="transmitNewsletterData"
            type="number"
            min="0"
            max="1"
            style="position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0;"
          />
          <SfSwitch
            :model-value="transmitNewsletterData === 1"
            @update:model-value="transmitNewsletterData = $event ? 1 : 0"
            class="uptain-switch checked:bg-editor-button checked:before:hover:bg-editor-button hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300"
          />
        </div>
      </div>

      <!-- Transmit personal data for existing customers -->
      <div class="flex justify-between">
        <UiFormLabel class="mb-1">{{ getEditorTranslation('transmitCustomerData.label') }}</UiFormLabel>
        <div style="position: relative;">
          <input
            v-model.number="transmitCustomerData"
            type="number"
            min="0"
            max="1"
            style="position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0;"
          />
          <SfSwitch
            :model-value="transmitCustomerData === 1"
            @update:model-value="transmitCustomerData = $event ? 1 : 0"
            class="uptain-switch checked:bg-editor-button checked:before:hover:bg-editor-button hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300"
          />
        </div>
      </div>

      <!-- Transmit revenue -->
      <div class="flex justify-between">
        <UiFormLabel class="mb-1">{{ getEditorTranslation('transmitRevenue.label') }}</UiFormLabel>
        <div style="position: relative;">
          <input
            v-model.number="transmitRevenue"
            type="number"
            min="0"
            max="1"
            style="position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0;"
          />
          <SfSwitch
            :model-value="transmitRevenue === 1"
            @update:model-value="transmitRevenue = $event ? 1 : 0"
            class="uptain-switch checked:bg-editor-button checked:before:hover:bg-editor-button hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300"
          />
        </div>
      </div>
    </div>

    <!-- Cookie Settings -->
    <div style="position: relative; border: 1px solid rgb(238 238 238 / 20%); padding: 1em; border-radius: 0.5em;" class="space-y-4">
      <div
        style="position: absolute; top: 0; left: 0.5em; z-index: 1; transform: translateY(-50%); padding: 0 0.5em; background: #111; font-size: 0.875em; color: #696969;"
      >
        {{ getEditorTranslation('cookieSettingsLabel') }}
      </div>

      <!-- Block cookies initially -->
      <div class="flex justify-between">
        <UiFormLabel class="mb-1">{{ getEditorTranslation('blockCookies.label') }}</UiFormLabel>
        <div style="position: relative;">
          <input
            v-model.number="blockCookiesInitially"
            type="number"
            min="0"
            max="1"
            style="position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0;"
          />
          <SfSwitch
            :model-value="blockCookiesInitially === 1"
            @update:model-value="blockCookiesInitially = $event ? 1 : 0"
            class="uptain-switch checked:bg-editor-button checked:before:hover:bg-editor-button hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300"
          />
        </div>
      </div>
    </div>

    <!-- Debugging -->
    <div style="display: none; position: relative; border: 1px solid rgb(238 238 238 / 20%); padding: 1em; border-radius: 0.5em;">
      <div
        style="position: absolute; top: 0; left: 0.5em; z-index: 1; transform: translateY(-50%); padding: 0 0.5em; background: #111; font-size: 0.875em; color: #696969;"
      >
        {{ getEditorTranslation('debuggingLabel') }}
      </div>
      <!-- Debug mode -->
      <div class="flex justify-between">
        <div>
          <UiFormLabel class="mb-1">{{ getEditorTranslation('debugMode.label') }}</UiFormLabel>
          <p class="text-sm text-neutral-500">{{ getEditorTranslation('debugMode.description') }}</p>
        </div>
        <div style="position: relative;">
          <input
            v-model.number="debugMode"
            type="number"
            min="0"
            max="1"
            style="position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0;"
          />
          <SfSwitch
            :model-value="debugMode === 1"
            @update:model-value="debugMode = $event ? 1 : 0"
            class="uptain-switch checked:bg-editor-button checked:before:hover:bg-editor-button hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300"
          />
        </div>
      </div>
    </div>

    <!-- Registration CTA -->
    <div style="border: 1px solid rgb(238 238 238 / 20%); padding: 1em; border-radius: 0.5em;">
      <h3 style="color: rgb(48, 187, 181); font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5em;">
        Noch kein Uptain-Kunde?
      </h3>
      <p style="font-size: 0.85rem; color: #9ca3af; margin-bottom: 1em;">
        Die Erstellung eines Accounts ist für Sie komplett unverbindlich. Newsletter Popups immer kostenfrei für Ihren Shop. Keine Kreditkarte benötigt.
      </p>
      <a
        href="https://uptain.de/registrieren/"
        target="_blank"
        rel="noopener noreferrer"
        style="display: inline-block; width: 100%; padding: 0.5em 1em; background-color: rgb(48, 187, 181); color: white; border-radius: 0.375rem; text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: background-color 0.2s; text-align: center;"
        onmouseover="this.style.backgroundColor='rgb(38, 150, 145)'"
        onmouseout="this.style.backgroundColor='rgb(48, 187, 181)'"
      >
        Jetzt registrieren
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip, SfSwitch } from '@storefront-ui/vue';

const { updateSetting: updateUptainEnabled, getSetting: getUptainEnabled } = useSiteSettings('uptainEnabled');
const { updateSetting, getSetting } = useSiteSettings('uptainId');
const { updateSetting: updateBlockCookies, getSetting: getBlockCookies } = useSiteSettings('uptainBlockCookiesInitially');
const { updateSetting: updateNewsletterData, getSetting: getNewsletterData } = useSiteSettings('uptainTransmitNewsletterData');
const { updateSetting: updateCustomerData, getSetting: getCustomerData } = useSiteSettings('uptainTransmitCustomerData');
const { updateSetting: updateRevenue, getSetting: getRevenue } = useSiteSettings('uptainTransmitRevenue');
const { updateSetting: updateDebugMode, getSetting: getDebugMode } = useSiteSettings('uptainDebugMode');

const uptainEnabled = computed({
  get: () => {
    const value = getUptainEnabled();
    if (value === 'true' || value === '1') return 1;
    if (value === 'false' || value === '0') return 0;
    return Number(value) || 0;
  },
  set: (value) => {
    const numValue = typeof value === 'number' ? value : (value ? 1 : 0);
    updateUptainEnabled(numValue.toString());
  },
});

const uptainId = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const blockCookiesInitially = computed({
  get: () => {
    const value = getBlockCookies();
    if (value === 'true' || value === '1') return 1;
    if (value === 'false' || value === '0') return 0;
    return Number(value) || 0;
  },
  set: (value) => {
    const numValue = typeof value === 'number' ? value : (value ? 1 : 0);
    updateBlockCookies(numValue.toString());
  },
});

const transmitNewsletterData = computed({
  get: () => {
    const value = getNewsletterData();
    if (value === 'true' || value === '1') return 1;
    if (value === 'false' || value === '0') return 0;
    return Number(value) || 0;
  },
  set: (value) => {
    const numValue = typeof value === 'number' ? value : (value ? 1 : 0);
    updateNewsletterData(numValue.toString());
  },
});

const transmitCustomerData = computed({
  get: () => {
    const value = getCustomerData();
    if (value === 'true' || value === '1') return 1;
    if (value === 'false' || value === '0') return 0;
    return Number(value) || 0;
  },
  set: (value) => {
    const numValue = typeof value === 'number' ? value : (value ? 1 : 0);
    updateCustomerData(numValue.toString());
  },
});

const transmitRevenue = computed({
  get: () => {
    const value = getRevenue();
    if (value === 'true' || value === '1') return 1;
    if (value === 'false' || value === '0') return 0;
    return Number(value) || 0;
  },
  set: (value) => {
    const numValue = typeof value === 'number' ? value : (value ? 1 : 0);
    updateRevenue(numValue.toString());
  },
});

const debugMode = computed({
  get: () => {
    const value = getDebugMode();
    if (value === 'true' || value === '1') return 1;
    if (value === 'false' || value === '0') return 0;
    return Number(value) || 0;
  },
  set: (value) => {
    const numValue = typeof value === 'number' ? value : (value ? 1 : 0);
    updateDebugMode(numValue.toString());
  },
});

const hasChanges = ref(false);

watch(
  [
    () => getUptainEnabled(),
    () => getSetting(),
    () => getBlockCookies(),
    () => getNewsletterData(),
    () => getCustomerData(),
    () => getRevenue(),
    () => getDebugMode(),
  ],
  () => {
    hasChanges.value = true;
  },
  { deep: true },
);
</script>

<i18n lang="json">
{
  "en": {
    "accountLabel": "Uptain Account",
    "basicSettingsLabel": "Basic Settings",
    "enableUptain": {
      "label": "Enable Uptain Tracking",
      "description": "Activate or deactivate the Uptain tracking script. When disabled, no scripts will be loaded."
    },
    "cookieSettingsLabel": "Cookie Settings",
    "debuggingLabel": "Debugging",
    "debugMode": {
      "label": "Debug Mode",
      "description": "Log Uptain script data on every change to the browser console."
    },
    "redeployWarning": "This group of settings will require a shop redeploy to take effect.",
    "uptainId": {
      "label": "Uptain Tracking ID",
      "placeholder": "Enter your Uptain tracking ID",
      "tooltip": "Enter your Uptain tracking ID to enable tracking on your shop. You can find this ID in your Uptain dashboard."
    },
    "blockCookies": {
      "label": "Initially block cookies and wait for visitor's cookie acceptance"
    },
    "transmitNewsletterData": {
      "label": "Transmit personal data of newsletter subscribers while being logged in"
    },
    "transmitCustomerData": {
      "label": "Transmit personal data of existing customers (minimum of one successful order) while being logged in"
    },
    "transmitRevenue": {
      "label": "Transmit the total sum of all net orders for a certain customer while being logged in"
    }
  },
  "de": {
    "accountLabel": "Uptain Konto",
    "basicSettingsLabel": "Grundeinstellungen",
    "enableUptain": {
      "label": "Uptain Tracking aktivieren",
      "description": "Aktivieren oder deaktivieren Sie das Uptain Tracking-Script. Wenn deaktiviert, werden keine Scripts geladen."
    },
    "cookieSettingsLabel": "Cookie-Einstellungen",
    "debuggingLabel": "Debugging",
    "debugMode": {
      "label": "Debug Modus",
      "description": "Uptain Script-Daten bei jeder Änderung in der Browser-Konsole loggen."
    },
    "redeployWarning": "Diese Gruppe von Einstellungen erfordert ein erneutes Deployment des Shops, um wirksam zu werden.",
    "uptainId": {
      "label": "Uptain Tracking ID",
      "placeholder": "Geben Sie Ihre Uptain Tracking-ID ein",
      "tooltip": "Geben Sie Ihre Uptain Tracking-ID ein, um das Tracking in Ihrem Shop zu aktivieren. Diese ID finden Sie in Ihrem Uptain-Dashboard."
    },
    "blockCookies": {
      "label": "Cookies zunächst blockieren und auf die Cookie-Zustimmung des Besuchers warten"
    },
    "transmitNewsletterData": {
      "label": "Personenbezogene Daten von Newsletter-Abonnenten während der Anmeldung übertragen"
    },
    "transmitCustomerData": {
      "label": "Personenbezogene Daten von Bestandskunden (mindestens eine erfolgreiche Bestellung) während der Anmeldung übertragen"
    },
    "transmitRevenue": {
      "label": "Gesamtsumme aller Netto-Bestellungen für einen bestimmten Kunden während der Anmeldung übertragen"
    }
  }
}
</i18n>

<style scoped>
.uptain-switch:checked {
  border-color: rgb(48, 187, 181);
}

.uptain-switch:checked::before {
  background-color: rgb(48, 187, 181);
}

.uptain-switch:checked:hover {
  border-color: rgb(48, 187, 181);
}

.uptain-switch:hover:not(:checked),
.uptain-switch:focus:not(:checked) {
  border-color: rgb(107, 114, 128);
}

.uptain-switch:hover:not(:checked)::before,
.uptain-switch:focus:not(:checked)::before {
  background-color: rgb(107, 114, 128);
}
</style>
