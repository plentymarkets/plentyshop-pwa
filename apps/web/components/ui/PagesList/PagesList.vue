<template>

    <ul
      v-if="!currentParent"
      class="p-2 transition-all duration-300"
      :class="{ 'translate-x-full opacity-0': currentParent }"
      ref="dropdownListRef"
    >
      <li
        v-for="page in pages"
        :key="page.name"
        class="p-2 text-gray-900 hover:bg-gray-100 rounded-md cursor-pointer flex justify-between"
        @click="handleClick(page)"
      >
        <span>{{ page.name }}</span>
        <span v-if="page.children"><SfIconChevronRight class="w-3 h3" /></span>
      </li>
    </ul>

    <ul
      v-if="currentParent"
      class="p-2 transition-all duration-300"
      :class="{ 'translate-x-0 opacity-100': currentParent, '-translate-x-full opacity-0': !currentParent }"
    >
      <li class="p-2 text-gray-500 hover:text-gray-900 cursor-pointer flex items-center" @click="goBack">
        <SfIconChevronLeft class="w-3 h-3" /> {{ currentParent.name }}
      </li>
      <li
        v-for="subPage in currentParent.children"
        :key="subPage.name"
        class="p-2 text-gray-900 hover:bg-gray-100 rounded-md cursor-pointer"
        @click="navigateTo(subPage.path)"
      >
        {{ subPage.name }}
      </li>
    </ul>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { SfIconChevronRight, SfIconChevronLeft } from '@storefront-ui/vue';

const router = useRouter();
const currentParent = ref(null);

// Sample Pages Data
const pages = ref([
  { name: 'About Page', path: '/about' },
  {
    name: 'Product page',
    children: [
      { name: 'Product 1', path: '/product-1' },
      { name: 'Product 2', path: '/product-2' },
      { name: 'Product 3', path: '/product-3' },
    ],
  },
]);

const handleClick = (page) => {
  if (page.children) {
    currentParent.value = page;
  } else {
    navigateTo(page.path);
  }
};

const goBack = () => {
  currentParent.value = null;
};

const navigateTo = (path) => {
  router.push(path);
};
</script>
