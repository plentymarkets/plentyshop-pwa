# Footer Block Refactoring

## Problem

The original `useFooterBlock` composable was overly complex and handled multiple responsibilities:

- Complex async loading logic with promise management
- Caching across multiple locations
- Duplicated default footer settings
- Mixed concerns between data fetching and content resolution
- Tight coupling between components

## Solution

The footer functionality has been refactored into two focused composables with clear separation of concerns:

### 1. `useFooterSettings` - Global Footer Configuration

**Responsibilities:**

- Centralized footer settings management
- Simple caching with useState
- Default settings factory function
- API fetching with proper error handling

**Key Features:**

- `createDefaultFooterSettings(t)` - Pure function for default values
- `getDefaultFooterSettings()` - Convenience wrapper with useI18n
- `fetchFooterSettings()` - Async fetching with fallback to defaults
- `getFooterSettings()` - Sync access to cached or default settings
- `clearFooterCache()` - Cache management

### 2. `useFooterBlock` - Component-Level Content Resolution

**Responsibilities:**

- Simple content resolution logic
- Handle prop vs cached content priority
- Provide computed values for components

**Simplified Logic:**

```typescript
// If content is provided as prop, use it
if (content) {
  return { resolvedContent: ref(content), cachedFooter };
}

// Otherwise use cached/default footer settings
const resolvedContent = computed(() => getFooterSettings());
```

## Benefits

### Reduced Complexity

- **Before**: 45 lines with promise management, complex state logic
- **After**: 12 lines with simple prop vs default resolution

### Better Separation of Concerns

- **Settings Management**: `useFooterSettings` handles global state
- **Content Resolution**: `useFooterBlock` handles component needs
- **Default Values**: Centralized in `createDefaultFooterSettings`

### Improved Testability

- Pure functions for default settings
- Mockable composables with clear interfaces
- No complex async state to manage in tests

### Consistent Defaults

- Single source of truth for default footer settings
- Reusable across different contexts (blocks, utilities, tests)
- Proper i18n integration

## Migration

### For Component Usage

The `useFooterBlock` API remains the same:

```typescript
// Still works exactly the same
const { resolvedContent } = useFooterBlock(props.content);
```

### For Footer Cache Access

Replace direct cache access with the new composable:

```typescript
// Before
const { cachedFooter } = useFooterBlock();

// After - same functionality
const { footerCache } = useFooterSettings();
```

### For Default Settings

Use the centralized factory function:

```typescript
// Before - duplicated everywhere
const defaults = {
  column1: { title: t('categories.legal.label') },
  // ... more duplication
};

// After - centralized
const { createDefaultFooterSettings } = useFooterSettings();
const defaults = createDefaultFooterSettings(t);
```

## Files Changed

### New Files

- `composables/useFooterSettings/useFooterSettings.ts` - New global settings composable
- `composables/useFooterSettings/index.ts` - Export file
- `composables/useFooterSettings/__tests__/useFooterSettings.spec.ts` - Unit tests

### Modified Files

- `composables/useFooterBlock/useFooterBlock.ts` - Simplified to 12 lines
- `composables/useFooterBlock/__tests__/useFooterBlock.spec.ts` - Updated tests
- `utils/addFooterBlock.ts` - Uses centralized defaults
- `composables/index.ts` - Added new export

This refactoring provides a much simpler, more maintainable approach to footer management while maintaining full backward compatibility.
