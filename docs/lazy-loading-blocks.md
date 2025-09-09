# Lazy Loading Blocks Guide

This guide explains how to add lazy-loading support to new block components in the PlentyONE Shop PWA.

## How Lazy Loading Works

The lazy-loading system uses IntersectionObserver to detect when a block comes into the viewport. The system is fully automated:

1. **Configuration**: Block lazy-load settings are defined in `useBlockManager`
2. **Detection**: `PageBlock` component automatically detects if a block should be lazy-loaded
3. **Observation**: IntersectionObserver is set up automatically when the block mounts
4. **Prop Injection**: When the block becomes visible, the configured prop is automatically passed to the component
5. **Unique Tracking**: Each block instance is tracked with a unique key based on block name and UUID

## Adding a New Lazy-Loadable Block

### Step 1: Configure the Block

Add your block to the `LAZY_LOAD_BLOCKS` configuration in `composables/useBlockManager/useBlockManager.ts`:

```typescript
const LAZY_LOAD_BLOCKS: Record<string, LazyLoadConfig> = {
  ProductRecommendedProducts: {
    propName: 'shouldLoad',
    rootMargin: '0px 0px 250px 0px',
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

const props = withDefaults(defineProps<MyNewLazyBlockProps>(), {
  shouldLoad: undefined, // Default to undefined for proper detection
});
```

### Step 3: Implement Lazy Loading Logic

In your component, implement the loading logic based on the prop. The system automatically handles the IntersectionObserver setup and prop injection:

```vue
<template>
  <div>
    <h2>{{ content.title }}</h2>

    <!-- Only render heavy content when shouldLoad is true -->
    <ExpensiveComponent v-if="shouldRender" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<MyNewLazyBlockProps>();

// Create a computed that handles both lazy loading and fallback for non-lazy blocks
const shouldRender = computed(() => props.shouldLoad === undefined || props.shouldLoad === true);

// Only fetch data when the component should load
const shouldFetch = computed(() => shouldRender.value && someCondition);

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

## How the System Works Internally

### Automatic Setup

The `PageBlock` component automatically:

1. **Detects lazy blocks**: Uses `shouldLazyLoad(blockName)` to check if a block needs lazy loading
2. **Creates unique keys**: Generates `blockName-blockUuid` keys for tracking individual block instances
3. **Sets up refs**: Automatically creates template refs for lazy-loadable blocks
4. **Configures observers**: Sets up IntersectionObserver with the configured thresholds
5. **Injects props**: Automatically passes the lazy load state as a prop to your component

### Unique Instance Tracking

Each block instance is tracked individually using a unique key pattern: `blockName-blockUuid`. This ensures that:

- Multiple instances of the same block type are tracked separately
- Each block's lazy load state is independent
- The system can handle complex nested block structures

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

// Load 250px before entering viewport (current default)
{
  propName: 'shouldLoad',
  rootMargin: '0px 0px 250px 0px',
  threshold: 0,
}

// Load when 50% of element is visible
{
  propName: 'shouldLoad',
  rootMargin: '0px',
  threshold: 0.5,
}
```
