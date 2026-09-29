<template>
  <div class="py-2 space-y-4">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('enabled-label') }}</UiFormLabel>
      <SfSwitch
        v-model="enabled"
        data-testid="four-seasons-enabled"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>

    <div>
      <UiFormLabel for="four-seasons-particle-type">{{ getEditorTranslation('particle-type-label') }}</UiFormLabel>
      <SfSelect id="four-seasons-particle-type" v-model="particleType" data-testid="four-seasons-particle-type" class="w-full mt-2">
        <option value="snow">{{ getEditorTranslation('particle-type-snow') }}</option>
        <option value="blossom">{{ getEditorTranslation('particle-type-blossom') }}</option>
        <option value="sunflower">{{ getEditorTranslation('particle-type-sunflower') }}</option>
        <option value="leaves">{{ getEditorTranslation('particle-type-leaves') }}</option>
      </SfSelect>
    </div>

    <div>
      <UiFormLabel for="four-seasons-flake-count">{{ getEditorTranslation('flake-count-label') }}</UiFormLabel>
      <SfInput
        id="four-seasons-flake-count"
        v-model="flakeCount"
        type="number"
        :min="MIN_FLAKE_COUNT"
        :max="MAX_FLAKE_COUNT"
        data-testid="four-seasons-flake-count"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfSelect, SfSwitch } from '@storefront-ui/vue';

const MIN_FLAKE_COUNT = 0;
const MAX_FLAKE_COUNT = 500;

const { updateSetting: updateEnabled, getBooleanSetting: getEnabled } = useSiteSettings('fourSeasonsEnabled');
const { updateSetting: updateParticleType, getSetting: getParticleType } = useSiteSettings('fourSeasonsParticleType');
const { updateSetting: updateFlakeCount, getNumberSetting: getFlakeCount } = useSiteSettings('fourSeasonsFlakeCount');

const enabled = computed({
  get: () => getEnabled(true),
  set: (value) => updateEnabled(value.toString()),
});

const particleType = computed({
  get: () => getParticleType() || 'leaves',
  set: (value) => updateParticleType(value),
});

const flakeCount = computed({
  get: () => getFlakeCount(60),
  set: (value) => updateFlakeCount(Math.min(MAX_FLAKE_COUNT, Math.max(MIN_FLAKE_COUNT, Number(value) || 0))),
});
</script>

<i18n lang="json">
{
  "en": {
    "enabled-label": "Enable seasonal particle effect",
    "particle-type-label": "Particle type",
    "particle-type-snow": "Snow",
    "particle-type-blossom": "Cherry blossom",
    "particle-type-sunflower": "Sunflower petals",
    "particle-type-leaves": "Falling leaves",
    "flake-count-label": "Particle count"
  },
  "de": {
    "enabled-label": "Enable seasonal particle effect",
    "particle-type-label": "Particle type",
    "particle-type-snow": "Snow",
    "particle-type-blossom": "Cherry blossom",
    "particle-type-sunflower": "Sunflower petals",
    "particle-type-leaves": "Falling leaves",
    "flake-count-label": "Particle count"
  }
}
</i18n>
