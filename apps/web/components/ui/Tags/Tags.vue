<template>
    <div>
        <ul v-if="tags && tags.length > 0" class="flex flex-row">
          <li v-for="(tag, index) in tags" :key="index">
            <p class="border rounded-xl inline-block text-center px-1 text-xs shadow-md" :style="{ backgroundColor: tag.color } as any">{{ tag.names.name }}</p>
          </li>
        </ul>
      </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-sdk';
import type { TagsProps } from '~/components/ui/Tags/types';

const { product } = withDefaults(defineProps<TagsProps>(), {});

const tags = productGetters.getTags(product);
</script>