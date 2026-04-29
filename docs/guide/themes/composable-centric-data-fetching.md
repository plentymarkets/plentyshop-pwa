# Composable‑Centric Data Fetching

Nuxt provides [`useAsyncData`](https://nuxt.com/docs/api/composables/use-async-data) for fetching data on the server side.
The shop uses `useAsyncData` to encapsulate data fetching in composables.
In this guide, you'll learn the benefits of this pattern and how to interact with these composables in your Vue components.

### Definition

`useAsyncData` is Nuxt’s built‑in helper that performs server‑side data fetching on the first request and caches the result for subsequent client hydration. The shop composables (e.g. useProducts) already call useAsyncData whenever they talk to the SDK.

```vue
// apps/web/app/pages/[...slug].vue

<script setup lang="ts">
const { fetchProducts, data: products } = useProducts('1');
await fetchProducts({ categoryId: '1' });
</script>
```

Call it, await it, render.
No additional `useAsyncData` necessary.

### Common Pitfalls and How to Avoid Them

1. Wrapping the composable call in another useAsyncData
   - This duplicates the network round‑trip and confuses Nuxt caching.
   - **Fix**: Call the composable method directly.
2. Bypassing composable and hitting SDK directly
   - This skips shared error handling and state logic.
   - **Fix**: Go through the composable unless you have a documented exception.
