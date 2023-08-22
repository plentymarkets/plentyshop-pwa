<template>
  <div>
    <div :class="basePriceCss">
      <div v-if="oneline" class="flex-1" />
      <div id="basePrice">
        {{ basePrice }}
        <!-- {{ productGetters.getDefaultBasePrice(product) }} -->
      </div>
      <div v-if="oneline" id="lineSeparator">|</div>
      <div id="content">
        <span v-if="!oneline" class="font-bold"> {{ $t('Content') }}: </span>
        <span class="mr-1">
          {{ unitContent }} {{ unitName }}
          <!-- {{ productGetters.getUnitContent(product) }} -->
          <!-- {{ productGetters.getUnitName(product) }} -->
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { productGetters } from '@plentymarkets/plentymarkets-sdk/packages/sdk/src';
import { BasePriceProps } from '~/components/BasePrice/types';

const props = defineProps<BasePriceProps>();
let basePriceCss = props.oneline ? 'inlineItems rearangeByRow' : 'twolineItems';

if (!props.oneline && props.contentLineFirst) {
  basePriceCss += ' rearangeByColumn';
}
</script>
<style scoped>
.rearangeByRow {
  flex-direction: row-reverse !important;
}

.rearangeByColumn {
  flex-direction: column-reverse !important;
}

.inlineItems {
  font-size: 75%;
  text-align: left !important;
  font-weight: 400;
  display: flex;
  width: 100%;
}

.twolineItems {
  display: flex;
  flex-direction: column;
  font-size: 75%;
  text-align: left;
  font-weight: 300;
}

.twolineItems #basePrice {
  width: 100%;
}

#lineSeparator {
  margin-right: 2px;
  margin-left: 2px;
}
</style>
