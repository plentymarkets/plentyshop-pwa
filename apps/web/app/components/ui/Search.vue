<template>
  <div class="relative w-full" ref="searchContainer">
    <form class="flex w-full bg-white border border-gray-400 rounded relative z-[60]" @submit.prevent="handleSearch">
      <input 
        v-model="searchQuery" 
        @input="onSearchInput"
        type="text" 
        :placeholder="t('common.actions.search')" 
        class="flex-1 px-4 py-2 outline-none text-black rounded-l"
        autocomplete="off"
      />
      <button 
        type="submit" 
        class="px-6 py-2 font-bold text-black border-l border-gray-300 hover:bg-gray-50 transition-colors"
      >
        und los!
      </button>
    </form>

    <div 
      v-if="showResults && searchResults.length > 0" 
      class="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-lg shadow-xl z-[100] overflow-hidden text-left mt-1"
    >
      <ul>
        <li 
          v-for="product in searchResults" 
          :key="product.id"
          class="flex items-center p-3 border-b border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors"
          @click="goToProduct(product)"
        >
          <div class="w-12 h-12 flex-shrink-0 mr-4 border border-gray-200 rounded overflow-hidden bg-white">
            <img 
              :src="product.image" 
              :alt="product.name" 
              class="w-full h-full object-contain"
            />
          </div>
          <div class="flex-1">
            <p class="text-black text-sm font-medium leading-tight line-clamp-2">
              {{ product.name }}
            </p>
          </div>
          <div class="ml-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { productGetters } from '@plentymarkets/shop-api';
import { onClickOutside } from '@vueuse/core';
import { paths } from '~/utils/paths';

const props = defineProps<{
  close?: () => boolean;
  initialQuery?: string;
  autoSubmit?: boolean;
}>();

const router = useRouter();
const localePath = useLocalePath();

const searchQuery = ref('');
const showResults = ref(false);
let debounceTimeout: NodeJS.Timeout | null = null;
const searchContainer = ref(null);

// Close dropdown if user clicks elsewhere on the screen
onClickOutside(searchContainer, () => {
  showResults.value = false;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { getSearch, data } = useSearch() as any;

const searchResults = computed(() => {
  const products = data.value?.products || [];
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return products.slice(0, 6).map((p: any) => {
    const itemId = p.item?.id || p.variation?.itemId;
    const variationId = p.variation?.id || productGetters.getId(p);
    
    const productName = productGetters.getName(p) || 'Unknown Product';
    const productImage = productGetters.getCoverImage(p) || 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png';
    
    const rawUrlPath = p.texts?.urlPath || `product/${itemId}`;
    const formattedUrl = rawUrlPath.startsWith('/') ? rawUrlPath : `/${rawUrlPath}`;
    const finalUrl = `${formattedUrl}_${itemId}_${variationId}`;

    return {
      id: variationId || itemId,
      name: productName,
      image: productImage,
      url: finalUrl
    };
  });
});

const onSearchInput = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  
  if (searchQuery.value.trim().length < 2) {
    showResults.value = false;
    return;
  }

  debounceTimeout = setTimeout(async () => {
    try {
      await getSearch({ term: searchQuery.value, itemsPerPage: 6 });
      if (searchResults.value.length > 0) {
        showResults.value = true;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Search Failed:", e);
    }
  }, 300);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const goToProduct = (product: any) => {
  showResults.value = false;
  searchQuery.value = ''; 
  props.close?.(); 
  
  const url = product.url.startsWith('http') ? product.url : localePath(product.url);
  
  if (product.url.startsWith('http')) {
     window.location.href = url;
  } else {
     router.push(url);
  }
};

const handleSearch = () => {
  if (searchQuery.value.trim().length > 0) {
    showResults.value = false;
    props.close?.();
    const targetPath = localePath(paths.search);
    window.location.href = `${targetPath}?term=${encodeURIComponent(searchQuery.value)}`;
  }
};

onMounted(() => {
  if (props.initialQuery?.trim()) {
    searchQuery.value = props.initialQuery.trim();
  }

  if (props.autoSubmit && searchQuery.value.length >= 2) {
    setTimeout(() => handleSearch(), 0);
  }
});
</script>