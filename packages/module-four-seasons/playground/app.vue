<template>
  <div style="padding: 2rem; font-family: sans-serif; max-width: 320px">
    <h1>Four Seasons Playground</h1>

    <label style="display: block; margin: 1rem 0">
      <input v-model="enabled" type="checkbox" />
      Enabled
    </label>

    <label style="display: block; margin: 1rem 0">
      Particle type
      <select v-model="particleType" style="display: block; margin-top: 0.25rem">
        <option value="snow">Snow</option>
        <option value="blossom">Blossom</option>
        <option value="sunflower">Sunflower</option>
        <option value="leaves">Leaves</option>
      </select>
    </label>

    <label style="display: block; margin: 1rem 0">
      Particle count
      <input v-model.number="flakeCount" type="number" min="0" max="500" style="display: block; margin-top: 0.25rem" />
    </label>
  </div>
</template>

<script setup lang="ts">
const { getBooleanSetting, updateSetting: updateEnabled } = useSiteSettings('fourSeasonsEnabled');
const { getSetting, updateSetting: updateParticleType } = useSiteSettings('fourSeasonsParticleType');
const { getNumberSetting, updateSetting: updateFlakeCount } = useSiteSettings('fourSeasonsFlakeCount');

const enabled = computed({
  get: () => getBooleanSetting(true),
  set: (value) => updateEnabled(value),
});

const particleType = computed({
  get: () => getSetting() || 'leaves',
  set: (value) => updateParticleType(value),
});

const flakeCount = computed({
  get: () => getNumberSetting(60),
  set: (value) => updateFlakeCount(value),
});
</script>
