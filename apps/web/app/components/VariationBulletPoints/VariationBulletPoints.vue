<template>
  <div v-if="bulletPointValues.length" class="mb-2 etc-bullet-points">
    <ul>
      <li v-for="(bullet, index) in bulletPointValues" :key="index">
        {{ bullet }}
      </li>
    </ul>
  </div>

  <div v-else-if="props.fallback" class="mb-2 etc-bullet-points" v-html="props.fallback" />


</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { BulletPointProps } from "./types";
import type {
  VariationPropertyGroup,
  VariationProperty
} from "@plentymarkets/shop-api";

const props = defineProps<BulletPointProps>();

// IDs deiner Bullet-Point-Eigenschaften
const BULLETPOINT_IDS = [427, 428, 429, 430, 431];

// Plenty: variationProperties = VariationPropertyGroup[]
const groups = computed<VariationPropertyGroup[]>(() => {
  return props.product.variationProperties ?? [];
});

// Plenty: Jede Gruppe enthält properties: VariationProperty[]
const allProperties = computed<VariationProperty[]>(() =>
  groups.value.flatMap((group) => group.properties ?? [])
);

// Da values kein Array ist, extrahieren wir direkt:
function extractValue(property: VariationProperty | undefined): string | null {
  if (!property) return null;
  if (!property.values) return null;

  const v = property.values;

  // Mehrsprachig?
  // Fall 1: Einfacher String
  if (typeof v.value === "string") {
    return v.value;
  }

  // Fall 2: value ist ein Language-Map {de: "...", en: "..."}
  if (typeof v.value === "object") {
    return v.value[props.language] ?? null;
  }

  return null;
}

const bulletPointValues = computed(() =>
  BULLETPOINT_IDS
    .map((id) => allProperties.value.find((p) => p.id === id))
    .map((p) => extractValue(p))
    .filter((v): v is string => !!v)
);
</script>

<style scoped>
  .etc-bullet-points li{
    list-style: disc;
    padding:0;
    margin: 0 1.25rem;
    font-weight: 500;
  }
  .etc-bullet-points ul{
    list-style: disc;
  }
</style>
