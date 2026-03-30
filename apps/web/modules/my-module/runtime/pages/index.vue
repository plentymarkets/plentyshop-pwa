<template>
  <div class="store-page">
    <header class="store-header">
      <div class="store-header__inner">
        <h1 class="store-header__title">Our Store</h1>
        <p class="store-header__subtitle">Handpicked products just for you</p>
      </div>
    </header>

    <div class="store-toolbar">
      <span class="store-toolbar__count">{{ filteredProducts.length }} products</span>
      <div class="store-toolbar__filters">
        <button
          v-for="cat in categories"
          :key="cat"
          class="store-toolbar__filter"
          :class="{ 'store-toolbar__filter--active': activeCategory === cat }"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <main class="store-grid">
      <StoreCard
        v-for="product in filteredProducts"
        :key="product.id"
        v-bind="product"
        @add-to-cart="onAddToCart"
      />
    </main>

    <Transition name="toast">
      <div v-if="toast" class="store-toast">
        ✓ {{ toast }} added to cart
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeCategory = ref('All')
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const products = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    price: 89.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    rating: 5,
    reviewCount: 214,
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Minimalist Leather Wallet',
    price: 34.50,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop',
    rating: 4,
    reviewCount: 87,
  },
  {
    id: 3,
    name: 'Stainless Steel Water Bottle',
    price: 24.95,
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
    rating: 4,
    reviewCount: 156,
    badge: 'New',
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    price: 129.00,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=300&fit=crop',
    rating: 5,
    reviewCount: 302,
  },
  {
    id: 5,
    name: 'Canvas Tote Bag',
    price: 19.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1544816565-aa8c1166648f?w=400&h=300&fit=crop',
    rating: 3,
    reviewCount: 45,
    badge: 'Sale',
  },
  {
    id: 6,
    name: 'Scented Soy Candle Set',
    price: 42.00,
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1a698?w=400&h=300&fit=crop',
    rating: 5,
    reviewCount: 98,
  },
]

const categories = ['All', ...new Set(products.map(p => p.category))]

const filteredProducts = computed(() =>
  activeCategory.value === 'All'
    ? products
    : products.filter(p => p.category === activeCategory.value)
)

function onAddToCart(item: { name: string; price: number }) {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = item.name
  toastTimer = setTimeout(() => {
    toast.value = ''
  }, 2500)
}
</script>

<style scoped>
.store-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: system-ui, -apple-system, sans-serif;
}

.store-header {
  background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
  color: #fff;
  padding: 48px 24px;
  text-align: center;
}

.store-header__inner {
  max-width: 960px;
  margin: 0 auto;
}

.store-header__title {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 8px;
}

.store-header__subtitle {
  font-size: 16px;
  opacity: 0.8;
  margin: 0;
}

.store-toolbar {
  max-width: 960px;
  margin: 32px auto 0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.store-toolbar__count {
  font-size: 14px;
  color: #64748b;
}

.store-toolbar__filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.store-toolbar__filter {
  padding: 6px 16px;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.store-toolbar__filter:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.store-toolbar__filter--active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

.store-grid {
  max-width: 960px;
  margin: 24px auto 64px;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
}

.store-toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #1a202c;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
</style>
