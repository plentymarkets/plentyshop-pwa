<template>
    <div class="border-t-2 my-2">
        <div v-for="(item, index) in items.products" :key="index" class="border-b-2 flex py-1">
            <img :src="item.imageUrl" :alt="item.name" class="h-[112px] w-[112px] pr-2" ref="image">
            <div class="h-24">
                <p>
                    {{ item.quantity }}x <span class="underline px-1 h-">{{ item.name }}</span>
                </p>
                <p class="h-auto line-clamp-3">{{ item.description }}</p>
            </div>
        </div>
    </div>
</template>


  
<script setup lang="ts">
  import { imgProps } from '@nuxt/image/dist/runtime/components/nuxt-img';
  import type { BundleOrderItemsProps } from '~/components/BundleOrderItems/types';
  
  // Typdefinition für ein fake Produkt
  interface Product {
    name: string;
    imageUrl: string;
    quantity: number;
    description: string;
    price: number;
    products?: Product[];
  }
  
  //fake data
  const items: Product = {
    name: 'Handschuhe und Mützen Bundle',
    imageUrl: 'https://via.placeholder.com/150',
    quantity: 1,
    description: 'Ein Bundle mit Handschuhen und Mützen für kalte Tage.',
    price: 22.99,
    products: [
      {
        name: 'Handschuhe',
        imageUrl: 'https://via.placeholder.com/150',
        quantity: 2,
        description: 'Ein Paar wärmende Handschuhe aus Wolle.',
        price: 9.99
      },
      {
        name: 'Mützen',
        imageUrl: 'https://via.placeholder.com/150',
        quantity: 1,
        description: 'Zwei gemütliche Mützen für kalte Tage.',
        price: 14.99
      }
    ]
  };
</script>