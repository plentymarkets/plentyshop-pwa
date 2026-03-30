<template>
  <div class="store-card">
    <div class="store-card__image-wrapper">
      <img :src="image" :alt="name" class="store-card__image" />
      <span v-if="badge" class="store-card__badge">{{ badge }}</span>
    </div>
    <div class="store-card__body">
      <p class="store-card__category">{{ category }}</p>
      <h3 class="store-card__name">{{ name }}</h3>
      <div class="store-card__rating">
        <span
          v-for="i in 5"
          :key="i"
          class="store-card__star"
          :class="{ 'store-card__star--filled': i <= rating }"
        >★</span>
        <span class="store-card__review-count">({{ reviewCount }})</span>
      </div>
      <div class="store-card__footer">
        <span class="store-card__price">${{ price.toFixed(2) }}</span>
        <button class="store-card__btn" @click="$emit('add-to-cart', { name, price })">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  price: number
  category: string
  image: string
  rating: number
  reviewCount: number
  badge?: string
}>()

defineEmits<{
  'add-to-cart': [item: { name: string; price: number }]
}>()
</script>

<style scoped>
.store-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.store-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.store-card__image-wrapper {
  position: relative;
  background: #f5f5f5;
  height: 200px;
  overflow: hidden;
}

.store-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #e53e3e;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
}

.store-card__body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 6px;
}

.store-card__category {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #718096;
  margin: 0;
}

.store-card__name {
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  line-height: 1.4;
}

.store-card__rating {
  display: flex;
  align-items: center;
  gap: 2px;
}

.store-card__star {
  font-size: 14px;
  color: #d1d5db;
}

.store-card__star--filled {
  color: #f59e0b;
}

.store-card__review-count {
  font-size: 12px;
  color: #9ca3af;
  margin-left: 4px;
}

.store-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.store-card__price {
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
}

.store-card__btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.store-card__btn:hover {
  background: #1d4ed8;
}

.store-card__btn:active {
  background: #1e40af;
}
</style>
