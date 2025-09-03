# Lazy Loading Blocks Guide

This guide explains how to add lazy-loading support to new block components in the PlentyONE Shop PWA.

## How Lazy Loading Works

The lazy-loading system uses IntersectionObserver to detect when a block comes into the viewport. When a block becomes visible (based on the configured thresholds), it automatically passes a prop to the component to indicate visibility.

## Adding a New Lazy-Loadable Block

### Step 1: Configure the Block

Add your block to the `LAZY_LOAD_BLOCKS` configuration in `composables/useBlockManager/useBlockManager.ts`:

```typescript
const LAZY_LOAD_BLOCKS: Record<string, LazyLoadConfig> = {
  ProductRecommendedProducts: {
    propName: 'shouldLoad',
    rootMargin: '0px 0px 150px 0px',
    threshold: 0,
  },

  // Add your new block here:
  MyNewLazyBlock: {
    propName: 'shouldLoad', // The prop name your component will receive
    rootMargin: '0px 0px 200px 0px', // Load when 200px before entering viewport
    threshold: 0.1, // 10% of the block must be visible
  },
};
```

### Step 2: Update Component Props

In your block component, add the lazy-loading prop to your types and props:

```typescript
// types.ts
export type MyNewLazyBlockProps = {
  shouldLoad?: boolean; // Add this prop (must match propName in config)
  // Other props
};

const props = withDefaults(defineProps<Props>(), {
  shouldLoad: false, // Default to false
});
```

### Step 3: Implement Lazy Loading Logic

In your component, implement the loading logic based on the prop:

```vue
<template>
  <div>
    <h2>{{ content.title }}</h2>

    <!-- Only render heavy content when shouldLoad is true -->
    <ExpensiveComponent v-if="shouldLoad" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<MyNewLazyBlockProps>();

// Only fetch data when the component should load
const shouldFetch = computed(() => props.shouldLoad && someCondition);

watch(
  shouldFetch,
  (shouldLoad) => {
    if (shouldLoad) {
      // Fetch your data here
      fetchExpensiveData();
    }
  },
  { immediate: true },
);
</script>
```

## Configuration Options

### LazyLoadConfig Properties

- **propName**: The name of the prop that will be passed to your component
- **rootMargin**: How much margin to add around the viewport for intersection detection
- **threshold**: What percentage of the element must be visible to trigger loading

### Common Patterns

```typescript
// Load immediately when any part enters viewport
{
  propName: 'shouldLoad',
  rootMargin: '0px',
  threshold: 0,
}

// Load 200px before entering viewport
{
  propName: 'shouldLoad',
  rootMargin: '0px 0px 200px 0px',
  threshold: 0,
}

// Load when 50% of element is visible
{
  propName: 'shouldLoad',
  rootMargin: '0px',
  threshold: 0.5,
}
```
