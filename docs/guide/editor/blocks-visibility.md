# How to control block visibility based on runtime data

## Overview

This guide explains how to hide a block when it has no meaningful runtime data to display — for example, when a product has no description text, or when a recommendations query returns an empty list.

Use this approach when your block fetches or derives data at runtime and should not render an empty shell when that data is absent. Do not use it for purely static blocks; the default static-content check already handles those.

::: info Theme developers only
`useBlocksVisibility` is only available inside `apps/web/`. It is not available in Nuxt modules.
:::

## Register block visibility

1. Obtain a computed ref for the data your block depends on.

2. Destructure `registerBlockVisibility` from `useBlocksVisibility`.

3. Watch the computed ref and call `registerBlockVisibility` on every change, passing `props.meta.uuid` as the first argument and a boolean indicating whether there is content to display as the second.

   ::: tip
   `props.meta.uuid` is a unique identifier provided automatically to every block component by the block framework.
   :::

4. Add `{ immediate: true }` to the watch options so the block registers its state on the initial render, not only when the value changes later.

The following example is for a block placed on a product page. If your block lives on a different page type, substitute `text` with whatever ref holds your block's runtime data.

```vue
<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import type { MyBlockProps } from './types';

const props = defineProps<MyBlockProps>();

// Step 1: computed ref for the block's runtime data
const { currentProduct } = useProducts();
const text = computed(() => productGetters.getDescription(currentProduct.value));

// Step 2: destructure from the composable
const { registerBlockVisibility } = useBlocksVisibility();

// Steps 3 & 4: watch with immediate:true to register on first render and on every change
watch(
  text,
  (value) => {
    registerBlockVisibility(props.meta.uuid, !!value); // [!code highlight]
  },
  { immediate: true },
);
</script>
```

To verify the implementation, place the block on a product page. Navigate to a page where the backend returns a non-empty value — the block renders normally. Then navigate to a page where the value is empty or absent — the block is suppressed and no empty shell appears in the storefront.

::: info
Do not unregister manually in `onBeforeUnmount`. The registry is cleared automatically when the page unmounts.
:::

::: info
In editor mode, all blocks are always shown regardless of the registry. This prevents blocks from appearing to disappear while a merchant is configuring the page.
:::

## See also

- [Blocks rendering](/guide/editor/blocks-rendering.md) — How block visibility is evaluated during the render cycle
- [Blocks architecture](/guide/editor/blocks-architecture.md) — Overview of the blocks data flow
