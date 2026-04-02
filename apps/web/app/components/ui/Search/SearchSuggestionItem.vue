<template>
  <NuxtLink
    :to="getSearchPath(item.label)"
    class="flex py-2 px-4 gap-2 text-neutral-500 cursor-pointer hover:bg-neutral-100 transition duration-200 ease-in-out"
    data-testid="search-suggestion-item"
  >
    <SfIconSearch class="mt-0.5 shrink-0" size="sm" aria-hidden="true" />
    <span class="text-black">
      <template v-if="match">
        {{ parsedText.before }}<b>{{ parsedText.match }}</b
        >{{ parsedText.after }}
      </template>
      <template v-else>{{ item.label }}</template>
    </span>

    <span>({{ item.count }})</span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { SfIconSearch } from '@storefront-ui/vue';
import type { SearchSuggestionItemProps } from './types';

const props = defineProps<SearchSuggestionItemProps>();

const { searchTerm } = useSearchSuggestions();
const parsedText = ref({ before: props.item.label, match: '', after: '' });
const match = ref(false);

const escaped = searchTerm.value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
const regex = new RegExp(`(${escaped})`, 'i');
const parts = props.item.label.split(regex);
if (parts.length > 2) {
  match.value = true;
  parsedText.value.before = parts[0] ?? '';
  parsedText.value.match = parts[1] ?? '';
  parsedText.value.after = parts[2] ?? '';
}
</script>
