<template>
    <div class="my-2 border-t-2 border-b-2 py-2 flex w-full">
        <img :src="items.imageUrl" :alt="items.name" class="h-[112px] w-[112px] pr-2" ref="image">
        <div class="w-full">
            <div>
                <p class="pb-1 flex justify-between">{{ items.name }} <SfIconDelete class="cursor-pointer hover:fill-red-600"/></p>
                <p v-for="(product, index) in items.products" :key="index" class="flex text-sm">
                    {{ product.quantity }}x <p class="px-1 underline">{{ product.name }}</p>
                </p>
            </div>
            <div class="self-end flex justify-between h-8 mt-3.5">
                <UiQuantitySelector
                    :key="1"
                    :value="quantity"
                    :min-value="0"
                    :max-value="4"
                />

                <p class="self-end text-orange-400 text-xl font-bold">{{ items.price }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
  import { imgProps } from '@nuxt/image/dist/runtime/components/nuxt-img';
  import type { BundleItemProps } from '~/components/BundleItem/types';
  import { SfIconDelete } from '@storefront-ui/vue';

  const quantity = computed(() => 0);

  //typdef für fake Produkt
  interface Product {
    name: string;
    imageUrl: string;
    quantity: number;
    description: string;
    price: string;
    products?: Product[];
  }
  
  //fake data
  const items: Product = {
    name: 'Handschuhe und Mützen Bundle',
    imageUrl: 'https://via.placeholder.com/150',
    quantity: 1,
    description: 'Ein Bundle mit Handschuhen und Mützen für kalte Tage.',
    price: '£22.99',
    products: [
      {
        name: 'Handschuhe',
        imageUrl: 'https://via.placeholder.com/150',
        quantity: 2,
        description: 'Ein Paar wärmende Handschuhe aus Wolle.',
        price: '£9.99'
      },
      {
        name: 'Mützen',
        imageUrl: 'https://via.placeholder.com/150',
        quantity: 1,
        description: 'Zwei gemütliche Mützen für kalte Tage.',
        price: '£14.99'
      }
    ]
  };
</script>