# Block Type System

## Overview

The PlentyONE Shop PWA uses a standardized type system for blocks based on generic extension of the `Block` interface from `@plentymarkets/shop-api`. This system provides type safety, backward compatibility, and consistent patterns across all block types.

### BlockProps Generic Pattern

All blocks should use the `BlockProps<TContent, TConfig>` generic type, which extends the base `Block` interface:

```typescript
import type { BlockProps } from '~/types/blocks';

// Basic usage
export type MyBlockProps = BlockProps<MyBlockContent>;

// With configuration type
export type MyBlockProps = BlockProps<MyBlockContent, MyBlockConfig>;
```

The `BlockProps` generic automatically includes:

- `name: string` - Block name identifier
- `type: string` - Block type (e.g., 'content', 'structure')
- `meta: { uuid: string }` - Block metadata with unique identifier
- `content: TContent` - Typed content structure
- `configuration?: TConfig` - Optional typed configuration
- `index?: number` - Optional position index

**Example:**

```typescript
import type { BlockProps, TextSection, ButtonSection, PaddingLayout } from '~/types/blocks';

export type MyBlockProps = BlockProps<MyBlockContent>;

export type MyBlockContent = {
  text: TextSection;
  button: ButtonSection;
  layout: PaddingLayout & {
    backgroundColor?: string;
  };
};
```

## When to Use Intersection for Runtime Properties

Some blocks receive properties injected at runtime (not stored in the database). Use TypeScript intersection types to extend `BlockProps` with these runtime properties:

```typescript
import type { BlockProps } from '~/types/blocks';
import type { Product } from '@plentymarkets/shop-api';

/**
 * ItemGrid block with runtime-injected properties.
 * Uses intersection pattern to extend BlockProps.
 */
export type ItemGridProps = BlockProps<ItemGridContent> & {
  products?: Product[]; // Runtime-injected
  productsPerPage?: number; // Runtime-injected
  totalProducts?: number; // Runtime-injected
};
```

**Common runtime-injected properties:**

- `products?: Product[]` - Product data loaded separately
- `category?: Category` - Category data loaded separately
- `shouldLoad?: boolean` - Lazy loading flag
- `product?: Product` - Single product context

**Example from ItemGrid:**

```typescript
export type ItemGridProps = BlockProps<ItemGridContent> & {
  products?: Product[];
  productsPerPage?: number;
  totalProducts?: number;
};
```

## Backward Compatibility with normalizePadding()

Legacy blocks (especially TextCard) stored padding values as strings (e.g., `"10"`, `"20px"`). The `normalizePadding()` utility provides runtime migration to number-based values.

### Using normalizePadding()

In components that need to handle legacy padding:

```typescript
import { normalizePadding } from '~/utils/normalize-padding';

const inlineStyle = computed(() => {
  // Runtime migration from legacy string-based padding to number-based
  const layout = normalizePadding(props.content.layout);

  return {
    paddingTop: `${layout.paddingTop}px`,
    paddingBottom: `${layout.paddingBottom}px`,
    paddingLeft: `${layout.paddingLeft}px`,
    paddingRight: `${layout.paddingRight}px`,
  };
});
```

### Using ensureLayoutDefaults()

In form components that initialize block content:

```typescript
import { ensureLayoutDefaults } from '~/utils/normalize-padding';

const rawContent = findOrDeleteBlockByUuid(data.value, uuid)?.content ?? {};

if (!rawContent.layout) {
  rawContent.layout = ensureLayoutDefaults({});
}
```

**Key differences:**

- `normalizePadding()` - Converts string/mixed types to numbers (runtime display)
- `ensureLayoutDefaults()` - Initializes missing padding properties to 0 (form initialization)

## Available Shared Primitive Types

The block type system provides shared primitives for composition:

### PaddingLayout

Standard padding structure with fullWidth support:

```typescript
import type { PaddingLayout } from '~/types/blocks';

export type MyBlockContent = {
  layout: PaddingLayout; // paddingTop, paddingBottom, paddingLeft, paddingRight, fullWidth?
};

// Or extend with additional properties
export type MyBlockContent = {
  layout: PaddingLayout & {
    backgroundColor?: string;
    narrowContainer?: boolean;
  };
};
```

### ButtonSection

Consistent button structure:

```typescript
import type { ButtonSection } from '~/types/blocks';

export type MyBlockContent = {
  button: ButtonSection; // label?, link?, variant?
};
```

### TextSection

Consistent text content structure:

```typescript
import type { TextSection } from '~/types/blocks';

export type MyBlockContent = {
  text: TextSection; // pretitle?, title?, subtitle?, htmlDescription?, textAlignment?, color?
};
```

### Shared Union Types

```typescript
import type {
  ButtonVariant, // 'primary' | 'secondary'
  TextAlignment, // 'left' | 'center' | 'right'
  FillMode, // 'fill' | 'fit'
  VerticalAlignment, // 'top' | 'center' | 'bottom'
} from '~/types/blocks';
```

## Creating Custom Blocks

For plugin developers extending the block system with new block types:

### Step 1: Define Block Types

Create a `types.ts` file for your custom block:

```typescript
// plugins/my-plugin/components/blocks/MyCustomBlock/types.ts
import type { BlockProps, TextSection, ButtonSection, PaddingLayout } from '~/types/blocks';

/**
 * Custom block for displaying special content
 */
export type MyCustomBlockProps = BlockProps<MyCustomBlockContent>;

export type MyCustomBlockContent = {
  text: TextSection;
  button: ButtonSection;
  layout: PaddingLayout & {
    backgroundColor?: string;
  };
  // Custom properties
  customField: string;
  customSettings: {
    enabled: boolean;
    value: number;
  };
};

export interface MyCustomBlockFormProps {
  uuid?: string;
}
```

### Step 2: Create Block Component

```vue
<!-- plugins/my-plugin/components/blocks/MyCustomBlock/MyCustomBlock.vue -->
<template>
  <div :style="inlineStyle">
    <h2>{{ props.content.text.title }}</h2>
    <p>{{ props.content.customField }}</p>
    <button v-if="props.content.button.label">
      {{ props.content.button.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { MyCustomBlockProps } from './types';
import { normalizePadding } from '~/utils/normalize-padding';

const props = defineProps<MyCustomBlockProps>();

const inlineStyle = computed(() => {
  const layout = normalizePadding(props.content.layout);

  return {
    backgroundColor: props.content.layout?.backgroundColor ?? 'transparent',
    paddingTop: `${layout.paddingTop}px`,
    paddingBottom: `${layout.paddingBottom}px`,
    paddingLeft: `${layout.paddingLeft}px`,
    paddingRight: `${layout.paddingRight}px`,
  };
});
</script>
```

### Step 3: Create Form Component

```vue
<!-- plugins/my-plugin/components/blocks/MyCustomBlock/MyCustomBlockForm.vue -->
<template>
  <div>
    <SfInput v-model="blockContent.text.title" label="Title" />
    <SfInput v-model="blockContent.customField" label="Custom Field" />
    <!-- Add form controls for other properties -->
  </div>
</template>

<script setup lang="ts">
import type { MyCustomBlockProps, MyCustomBlockContent } from './types';
import { ensureLayoutDefaults } from '~/utils/normalize-padding';

const props = defineProps<MyCustomBlockFormProps>();

const { findOrDeleteBlockByUuid } = useBlockManager();
const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);

const blockContent = computed<MyCustomBlockContent>(() => {
  const uuid = props.uuid || blockUuid.value;
  const rawContent = findOrDeleteBlockByUuid(data.value, uuid)?.content ?? {};
  const content = rawContent as Partial<MyCustomBlockContent>;

  // Initialize defaults
  if (!content.text) {
    content.text = { title: '' };
  }

  if (!content.layout) {
    content.layout = ensureLayoutDefaults({});
  }

  if (!content.customSettings) {
    content.customSettings = { enabled: false, value: 0 };
  }

  return content as MyCustomBlockContent;
});
</script>
```

### Step 4: Create Test Mock

```typescript
// plugins/my-plugin/components/blocks/MyCustomBlock/__tests__/MyCustomBlock.mock.ts
import type { MyCustomBlockProps } from '../types';

/**
 * Mock MyCustomBlock for testing
 * Fully typed with MyCustomBlockProps for type safety
 */
export const mockMyCustomBlock: MyCustomBlockProps = {
  name: 'MyCustomBlock',
  type: 'content',
  meta: { uuid: 'test-uuid-123' },
  content: {
    text: {
      title: 'Test Title',
      textAlignment: 'center',
    },
    button: {
      label: 'Click Me',
      link: '/test',
      variant: 'primary',
    },
    layout: {
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: '#ffffff',
    },
    customField: 'Custom Value',
    customSettings: {
      enabled: true,
      value: 42,
    },
  },
};
```

### Step 5: Register Block

Follow the plugin system's block registration process to make your custom block available in the block system. The block will automatically be discovered through the dynamic import system in `utils/blocks-imports.ts`.

## Reference

For complete type definitions and additional JSDoc documentation, see:

- `apps/web/app/types/blocks.ts` - Core type definitions
- `apps/web/app/utils/normalize-padding.ts` - Padding normalization utilities
- `apps/web/app/components/blocks/` - Example block implementations

### Key Principles

1. **Always use `BlockProps<TContent, TConfig>`** for new blocks
2. **Use intersection types** for runtime-injected properties
3. **Leverage shared primitives** (PaddingLayout, ButtonSection, TextSection) for consistency
4. **Handle legacy data** with `normalizePadding()` when needed
5. **Initialize forms** with `ensureLayoutDefaults()` for padding properties
6. **Provide full type annotations** in test mocks
7. **Document runtime properties** with JSDoc comments

This standardized approach ensures type safety, maintainability, and a consistent developer experience across the entire block system.
