# Z-Index Refactoring Analysis

## Current State: 20 Z-Index Levels 😱

```typescript
base: '0'           // 0
raised: '1'         // 1
overlap: '2'        // 2
editor-drawer: '10' // 10
editor-inline: '30' // 30
sticky: '40'        // 40
dropdown: '50'      // 50
notifications: '60' // 60
drawer-backdrop: '70' // 70
drawer: '80'        // 80
cookiebar: '90'     // 90
editor-toolbar: '100' // 100
modal-backdrop: '200' // 200
modal: '210'        // 210
popover: '220'      // 220
loader: '300'       // 300
picker: '400'       // 400
toast: '500'        // 500
max: '9999'         // 9999
```

## Usage Analysis (164 occurrences found)

### Most Used (Should Keep)
- **z-dropdown**: 37 uses - dropdowns, tooltips, menus
- **z-modal-backdrop**: 10 uses - modal overlays
- **z-modal**: 9 uses - modal dialogs
- **z-sticky**: 8 uses - sticky headers/navbars
- **z-loader**: 8 uses - loading spinners
- **z-drawer**: 4 uses - side drawers
- **z-drawer-backdrop**: 3 uses - drawer overlays
- **z-base/raised/overlap**: ~20 uses - layering blocks

### Editor-Specific (Keep Separate)
- **z-editor-toolbar**: 6 uses - editor sidebar
- **z-editor-drawer**: 4 uses - editor panels
- **z-editor-inline**: 7 uses - editor controls

### Rarely Used (Can Consolidate)
- **z-cookiebar**: 3 uses
- **z-notifications**: 1 use
- **z-popover**: 8 uses (similar to dropdown)
- **z-picker**: 3 uses (similar to dropdown)
- **z-toast**: 4 uses (similar to modal)
- **z-max**: 5 uses

## Problems Identified

### 1. **Stacking Context Hell**
Components with `z-index` create stacking contexts that trap children:
- `UtilityBar` header: `z-raised` (1) → NavbarBottom inside can't escape
- `MegaMenu` header: `z-sticky` (40) → Dropdown inside is trapped
- **Solution**: Teleport fixed/absolute overlays to `<body>`

### 2. **Too Many Similar Levels**
- `dropdown` (50), `popover` (220), `picker` (400) → all floating UI elements
- `toast` (500), `notifications` (60) → both notifications
- `modal` (210), `max` (9999) → both top-level overlays

### 3. **EditableBlocks Uses z-base**
Blocks at `z-base` (0) should be below everything, but parent stacking contexts break this.

## Proposed Simplified System: 5 Core Levels

```typescript
zIndex: {
  // Content layer (blocks, cards)
  content: '0',
  
  // UI overlays (dropdowns, tooltips, popovers, pickers)
  overlay: '50',
  
  // Modals & drawers (includes backdrops at 49)
  modal: '100',
  
  // Editor tools (when in editor mode)
  editor: '150',
  
  // Critical alerts & loaders
  critical: '200',
}
```

## Migration Strategy

### Phase 1: Teleport Everything Fixed/Absolute to Body ✅

**Already Done:**
- ✅ NavbarBottom (UtilityBar + auth layout)
- ✅ Navigation drawer (mobile)

**Needs Teleport:**
- [ ] MegaMenu desktop dropdown
- [ ] MegaMenu mobile drawer
- [ ] All modal dialogs
- [ ] All drawer components
- [ ] Toast notifications
- [ ] Cookiebar

**Why:** Teleported elements escape parent stacking contexts and work predictably with root-level z-index.

### Phase 2: Consolidate Z-Index Tokens

```typescript
// BEFORE (20 levels)
dropdown: '50'
popover: '220'
picker: '400'

// AFTER (1 level)
overlay: '50'  // All floating UI
```

**Mapping:**
- `base/raised/overlap` → `content` (0-2 range)
- `dropdown/popover/picker` → `overlay` (50)
- `modal/modal-backdrop/drawer/drawer-backdrop/toast` → `modal` (100)
- `editor-*` → `editor` (150)
- `loader/notifications/max/cookiebar` → `critical` (200)
- `sticky` → **REMOVE** (use position: sticky without z-index)

### Phase 3: Remove z-index from Sticky Elements

**Current Issue:**
```vue
<!-- Creates stacking context, traps children -->
<header class="sticky z-sticky">
  <NavbarBottom class="fixed z-sticky" /> <!-- Trapped! -->
</header>
```

**Solution:**
```vue
<!-- No z-index = no stacking context -->
<header class="sticky">
  <!-- Children free to stack naturally -->
</header>

<!-- Teleport fixed elements to body -->
<Teleport to="body">
  <NavbarBottom class="fixed z-overlay" />
</Teleport>
```

## Specific Component Actions

### High Priority (Blocking Issues)

1. **EditableBlocks** - Remove `z-base` class
   - Let blocks stack naturally at z-index: auto
   - Only editor overlays need explicit z-index

2. **UtilityBar/MegaMenu Headers** - Remove `z-raised`/`z-sticky`
   - Sticky position works without z-index
   - Prevents stacking context traps

3. **All Drawers/Modals** - Teleport to body
   - Ensures they're always on top
   - Simplifies z-index management

### Files to Update (Priority Order)

```
1. EditableBlocks.vue - remove z-base from PageBlock
2. UtilityBar.vue - remove z-raised from header
3. MegaMenu.vue - remove z-sticky from header, teleport dropdown/drawer
4. Navigation.vue - (already teleported) ✅
5. NavbarBottom.vue - (already teleported) ✅
6. All modal components - teleport to body
7. Cookiebar.vue - teleport to body
8. Toast/Notifications - teleport to body
9. tailwind.config.ts - update z-index tokens
```

## Testing Checklist

After refactoring, verify:
- [ ] Mobile navbar stays above content blocks
- [ ] Mega menu dropdown appears above blocks
- [ ] Navigation drawer appears above blocks
- [ ] Modals appear above everything
- [ ] Editor toolbar accessible above modals
- [ ] Sticky headers don't trap child elements
- [ ] No visual regressions on desktop/tablet/mobile

## Quick Win: Immediate Fix

**Remove `z-base` from EditableBlocks PageBlock:**
```diff
- class="group relative z-base"
+ class="group relative"
```

**Why:** Blocks don't need explicit z-index. They should stack naturally behind overlays.

## Long-term Benefits

- **5 z-index levels** instead of 20 (75% reduction)
- **Predictable stacking**: Teleport = root level, always works
- **No stacking context traps**: No more "why is this behind that?"
- **Easier debugging**: Less cognitive load
- **Better performance**: Fewer repaints from z-index changes
