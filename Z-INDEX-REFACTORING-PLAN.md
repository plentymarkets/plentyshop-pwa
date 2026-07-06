# Z-Index Refactoring Plan

**Goal:** Reduce from 20 z-index levels to 5, fix stacking context issues, use Teleport for overlays.

---

## Phase 1: Quick Wins - Fix Immediate Blocking Issues

### 1.1 Remove z-base from EditableBlocks
**File:** `apps/web/app/components/EditableBlocks/EditableBlocks.vue`  
**Line:** 28  
**Change:**
```diff
- class="group relative z-base"
+ class="group relative"
```
**Why:** Blocks don't need explicit z-index. Let them stack naturally.

---

### 1.2 Remove z-index from Sticky Headers (Prevents Stacking Context Traps)

#### UtilityBar
**File:** `apps/web/app/components/blocks/UtilityBar/UtilityBar.vue`  
**Line:** 3  
**Change:**
```diff
- <header class="relative w-full @md:sticky @md:shadow-md z-raised">
+ <header class="relative w-full @md:sticky @md:shadow-md">
```

#### MegaMenu
**File:** `apps/web/app/components/MegaMenu/MegaMenu.vue`  
**Line:** 2  
**Change:**
```diff
- <header ref="referenceRef" :class="headerClass" class="relative w-full @md:sticky @md:shadow-md z-sticky">
+ <header ref="referenceRef" :class="headerClass" class="relative w-full @md:sticky @md:shadow-md">
```

**Line:** 277 (remove dynamic z-sticky class)
```diff
- const headerClass = computed(() => ({ 'z-sticky': isOpen.value }));
+ const headerClass = computed(() => ({}));
```

#### SimplifiedHeader
**File:** `apps/web/app/components/ui/SimplifiedHeader.vue`  
**Line:** 2  
**Change:**
```diff
- <header class="relative w-full z-sticky @md:sticky @md:shadow-md">
+ <header class="relative w-full @md:sticky @md:shadow-md">
```

**Line:** 5  
```diff
- class="flex justify-between items-center flex-wrap @md:flex-nowrap px-4 @md:px-10 py-3 @md:py-5 w-full border-0 border-neutral-200 @md:z-sticky"
+ class="flex justify-between items-center flex-wrap @md:flex-nowrap px-4 @md:px-10 py-3 @md:py-5 w-full border-0 border-neutral-200"
```

#### NavbarTop
**File:** `apps/web/app/components/ui/NavbarTop.vue`  
**Line:** 4  
**Change:**
```diff
- 'h-14 @md:h-20 flex z-sticky @md:sticky @md:-top-5 @md:pt-2.5 @md:shadow-md',
+ 'h-14 @md:h-20 flex @md:sticky @md:-top-5 @md:pt-2.5 @md:shadow-md',
```

#### HeaderBlocks
**File:** `apps/web/app/components/ui/HeaderBlocks/HeaderBlocks.vue`  
**Line:** 26  
**Change:**
```diff
- { 'sticky top-0 z-dropdown': (headerBlock.value as HeaderContainerBlock | undefined)?.configuration?.layout?.sticky },
+ { 'sticky top-0': (headerBlock.value as HeaderContainerBlock | undefined)?.configuration?.layout?.sticky },
```

---

## Phase 2: Teleport All Fixed Overlays to Body

### 2.1 MegaMenu - Teleport Dropdown and Drawer

**File:** `apps/web/app/components/MegaMenu/MegaMenu.vue`

#### Desktop Dropdown (Lines 76-135)
**Before:**
```vue
<div
  v-if="isOpen && activeMenu && ..."
  :style="style"
  class="hidden @md:grid ... z-sticky ..."
>
```

**After:**
```vue
<Teleport to="body">
  <div
    v-if="isOpen && activeMenu && ..."
    :style="style"
    class="hidden @md:grid ... z-overlay ..."
  >
  <!-- content -->
  </div>
</Teleport>
```

#### Mobile Drawer (Lines 137-217)
**Wrap entire mobile section:**
```vue
<Teleport to="body">
  <template v-if="viewport.isLessThan('lg')">
    <div v-if="isOpen" class="fixed z-backdrop ..." />
    <SfDrawer ... class="... z-drawer">
      <!-- content -->
    </SfDrawer>
  </template>
</Teleport>
```

---

### 2.2 Navigation Block - Teleport Mobile Drawer

**File:** `apps/web/app/components/blocks/Navigation/Navigation.vue`  
**Status:** ✅ Already done (Lines 117-196)

---

### 2.3 Cookiebar - Teleport to Body

**File:** `apps/web/app/components/Cookiebar/Cookiebar.vue`

**Lines 3-154:** Wrap main cookiebar
```vue
<Teleport to="body">
  <aside v-if="showCookiebar" class="... z-overlay">
    <!-- content -->
  </aside>
</Teleport>
```

**Lines 155-172:** Wrap cookie settings button
```vue
<Teleport to="body">
  <UiButton v-if="showCookieSettingsBtn" class="... z-overlay">
    <!-- content -->
  </UiButton>
</Teleport>
```

---

### 2.4 Modal Components - Teleport All

#### AddBlockPopover
**File:** `apps/web/app/components/AddBlockPopover/AddBlockPopover.vue`  
**Lines 3-156:** Already uses fixed positioning, wrap in Teleport
```vue
<Teleport to="body">
  <div v-if="isOpen">
    <div class="fixed inset-0 z-backdrop" @click="closeAddBlockPopover" />
    <div class="fixed z-modal ...">
      <!-- content -->
    </div>
  </div>
</Teleport>
```

#### HtmlEditor
**File:** `apps/web/app/components/editor/HtmlEditor/HtmlEditor.vue`  
**Lines 3-30:** Wrap modal
```vue
<Teleport to="body">
  <div v-if="isOpen" class="fixed inset-0 ... z-backdrop">
    <!-- content -->
  </div>
</Teleport>
```

#### RichtextEditorModal
**File:** `apps/web/app/components/editor/RichTextEditor/RichtextEditorModal.vue`  
**Lines 3-32:** Wrap modal
```vue
<Teleport to="body">
  <div v-if="isOpen" class="fixed inset-0 ... z-backdrop">
    <!-- content -->
  </div>
</Teleport>
```

#### RichTextEditorLinkModal
**File:** `apps/web/app/components/editor/RichTextEditor/RichTextEditorLinkModal.vue`  
**Lines 3-71:** Wrap modal
```vue
<Teleport to="body">
  <div v-if="isOpen" class="fixed inset-0 z-overlay ...">
    <!-- content -->
  </div>
</Teleport>
```

#### ItemPropertiesSelectModal
**File:** `apps/web/app/components/blocks/PriceCard/ItemPropertiesSelectModal.vue`  
**Lines 1-67:** Wrap entire modal
```vue
<Teleport to="body">
  <UiOverlay :visible="true" class="fixed inset-0 z-backdrop ...">
    <!-- content -->
  </UiOverlay>
</Teleport>
```

#### ImageSelectorModal
**File:** `apps/web/app/components/ui/ImageSelectorModal/ImageSelectorModal.vue**  
**Lines 5-46:** Wrap modal
```vue
<Teleport to="body">
  <div v-if="isOpen" class="fixed inset-0 ... z-backdrop">
    <!-- content -->
  </div>
</Teleport>
```

#### NotifyMe Modal
**File:** `apps/web/app/components/NotifyMe/NotifyMe.vue`  
**Lines 22-24:** Modal already uses SfModal, update z-index class
```diff
- class="h-full w-full overflow-auto @md:w-[600px] @md:h-fit z-max"
+ class="h-full w-full overflow-auto @md:w-[600px] @md:h-fit z-modal"
```

#### PageModal, ResetProductPageModal, UnlinkCategoryModal
All use `UiPageModal` which wraps `SfModal` - already teleported by StorefrontUI.  
**Action:** Update `overlay-classes` prop
```diff
- overlay-classes="z-modal-backdrop"
+ overlay-classes="z-backdrop"
```

**Files:**
- `apps/web/app/components/ui/PageModal/PageModal.vue` (Line 8)
- `apps/web/app/components/ui/ResetProductPageModal/ResetProductPageModal.vue` (Line 8)
- `apps/web/app/components/ui/UnlinkCategoryModal/UnlinkCategoryModal.vue` (Line 8)

---

### 2.5 Drawer Components

#### EditorLocalizationDrawer
**File:** `apps/web/app/components/editor/Localization/EditorLocalizationDrawer.vue`  
**Status:** Already fixed positioned, wrap in Teleport
```vue
<Teleport to="body">
  <div v-if="drawerOpen" class="... !fixed ... z-editor">
    <!-- content -->
  </div>
</Teleport>
```

#### CategorySidebar (Mobile)
**File:** `apps/web/app/components/CategorySidebar/CategorySidebar.vue`  
**Line 15:** Has conditional mobile drawer classes
```diff
- class="w-full rounded shadow-none @md:translate-x-0 z-editor-toolbar @md:z-base @md:static @md:!block -translate-x-full shrink-0 bg-white overflow-y-auto"
+ class="w-full rounded shadow-none @md:translate-x-0 @md:static @md:!block -translate-x-full shrink-0 bg-white overflow-y-auto"
```
**Then:** Wrap mobile version in Teleport (needs component refactor to split desktop/mobile)

---

### 2.6 Notifications & Toast

#### Notifications
**File:** `apps/web/app/components/ui/Notifications/Notifications.vue`  
**Lines 1-8:** Wrap in Teleport
```vue
<Teleport to="body">
  <div data-testid="notifications" class="fixed right-2 max-w-[450px] z-overlay top-4">
    <!-- content -->
  </div>
</Teleport>
```

---

### 2.7 Tooltips & Popovers (Keep as-is, but update z-index)

These use Floating UI and are already positioned correctly. Just update class names in Phase 3.

**No structural changes needed for:**
- ColorPicker (uses Floating UI)
- IconEmojiPicker (uses Floating UI)
- All SfTooltip components (handled by library)
- SfDropdown components (handled by library)

---

## Phase 3: Update Z-Index Class Names

**Run find-and-replace across entire `apps/web/app/` directory:**

### Content Layer (Blocks, Cards)
```
z-base       → (remove entirely)
z-raised     → (remove or use relative positioning)
z-overlap    → (remove or use z-overlay if floating)
```

### Overlay Layer (Dropdowns, Tooltips, Popovers, Pickers)
```
z-dropdown   → z-overlay
z-popover    → z-overlay
z-picker     → z-overlay
z-sticky     → (remove - sticky doesn't need z-index)
```

### Modal Layer (Modals, Drawers, Backdrops)
```
z-modal-backdrop → z-backdrop
z-drawer-backdrop → z-backdrop
z-modal      → z-modal
z-drawer     → z-drawer
z-toast      → z-modal
z-notifications → z-overlay
z-cookiebar  → z-overlay
```

### Editor Layer
```
z-editor-drawer   → z-editor
z-editor-inline   → z-editor
z-editor-toolbar  → z-editor
```

### Critical Layer (Loaders, Alerts)
```
z-loader     → z-critical
z-max        → z-critical
```

---

## Phase 4: Update Tailwind Config

**File:** `apps/web/app/configuration/tailwind.config.ts`  
**Lines 162-182**

**Replace entire zIndex object:**
```typescript
zIndex: {
  // Content layer - regular page content
  // Note: Most content doesn't need explicit z-index
  content: '0',
  
  // Overlay layer - dropdowns, tooltips, popovers, notifications
  overlay: '50',
  
  // Modal layer - modals and drawers with backdrops
  backdrop: '100',    // Modal/drawer backdrops
  drawer: '110',      // Side drawers
  modal: '120',       // Modal dialogs
  
  // Editor layer - editor-specific UI (only in editor mode)
  editor: '150',
  
  // Critical layer - loaders, alerts that must be on top
  critical: '200',
},
```

---

## Phase 5: Remove Unused Z-Index Classes

### 5.1 MultiGrid Editor Components

**File:** `apps/web/app/components/blocks/structure/MultiGrid/MultiGrid.vue`  
**Line 12:**
```diff
- class="group/col relative @md:z-raised"
+ class="group/col relative"
```

**File:** `apps/web/app/components/blocks/structure/MultiGrid/MultiGridEditor.vue`  
**Lines 17, 26, 76:** Remove z-base, z-raised
```diff
- <div class="absolute inset-0 flex pointer-events-none z-base">
+ <div class="absolute inset-0 flex pointer-events-none">

- <div class="relative z-raised">
+ <div class="relative">

- class="absolute right-0 top-0 bottom-0 w-3 flex items-center justify-center cursor-col-resize z-raised"
+ class="absolute right-0 top-0 bottom-0 w-3 flex items-center justify-center cursor-col-resize"
```

---

### 5.2 BlockActions & PageBlock

**File:** `apps/web/app/components/ui/BlockActions/BlockActions.vue`  
**Line 4:**
```diff
- 'absolute inline-flex items-center gap-0.5 p-1 z-base @md:z-raised @lg:z-editor-inline',
+ 'absolute inline-flex items-center gap-0.5 p-1 z-editor',
```

**File:** `apps/web/app/components/PageBlock/PageBlock.vue**  
**Lines 23, 35, 97, 140:**
```diff
- class="pointer-events-none absolute inset-[-6px] z-modal-backdrop block-selected-outline"
+ class="pointer-events-none absolute inset-[-6px] z-backdrop block-selected-outline"

- '!z-modal': isPopoverTarget && popoverState?.position === 'top',
+ '!z-editor': isPopoverTarget && popoverState?.position === 'top',

- '!z-modal': isPopoverTarget && popoverState?.position === 'bottom',
+ '!z-editor': isPopoverTarget && popoverState?.position === 'bottom',

- 'absolute left-1/2 -translate-x-1/2 z-base @md:z-raised @lg:z-editor-inline',
+ 'absolute left-1/2 -translate-x-1/2 z-editor',
```

---

### 5.3 Gallery Component

**File:** `apps/web/app/components/Gallery/Gallery.vue`  
**Lines 163, 170:** Remove z-raised (navigation buttons)
```diff
- 'hidden md:flex items-center justify-center absolute z-raised rounded-full p-2 bg-white ring-1 ring-neutral-300 disabled:opacity-40',
+ 'hidden md:flex items-center justify-center absolute rounded-full p-2 bg-white ring-1 ring-neutral-300 disabled:opacity-40',
```

---

### 5.4 SettingsToolbar & Editor Panels

**File:** `apps/web/app/components/SettingsToolbar/SettingsToolbar.vue`  
**Line 3:**
```diff
- class="h-[calc(100vh-50px)] bg-white z-editor-inline @md:z-editor-toolbar @lg:z-editor-toolbar mb-3 w-toolbar min-w-toolbar border-r"
+ class="h-[calc(100vh-50px)] bg-white z-editor mb-3 w-toolbar min-w-toolbar border-r"
```

**File:** `apps/web/app/components/ui/Toolbar/Toolbar.vue`  
**Line 102:**
```diff
- isDrawerOpen.value ? 'lg:z-editor-drawer md:z-editor-toolbar' : 'md:z-editor-drawer',
+ 'z-editor',
```

**File:** `apps/web/app/components/SiteConfigurationDrawer/BlocksConfigurationDrawer.vue`  
**Line 3:**
```diff
- <div class="flex-shrink-0 w-1/4 min-w-[250px] max-w-[340px] bg-neutral-50 border-0 border-gray-300 z-editor-drawer">
+ <div class="flex-shrink-0 w-1/4 min-w-[250px] max-w-[340px] bg-neutral-50 border-0 border-gray-300 z-editor">
```

**File:** `apps/web/app/components/SiteConfigurationDrawer/SiteConfigurationDrawer.vue`  
**Line 4:**
```diff
- class="flex-shrink-0 w-1/4 min-w-[250px] max-w-[300px] bg-neutral-50 border-0 border-gray-300 z-editor-drawer relative h-full"
+ class="flex-shrink-0 w-1/4 min-w-[250px] max-w-[300px] bg-neutral-50 border-0 border-gray-300 z-editor relative h-full"
```

---

### 5.5 Miscellaneous Components

**File:** `apps/web/app/components/ui/Badges/Badges.vue`  
**Line 2:**
```diff
- <div v-if="haveBadges" data-testid="badges" class="z-overlap">
+ <div v-if="haveBadges" data-testid="badges">
```

**File:** `apps/web/app/components/ui/Breadcrumbs/Breadcrumbs.vue`  
**Lines 4, 10:**
```diff
- <li class="flex items-center @sm:hidden text-neutral-500 z-overlap">
+ <li class="flex items-center @sm:hidden text-neutral-500">

- class="z-overlap"
+ (remove class entirely)
```

**File:** `apps/web/app/components/ui/CategoryCard/CategoryCard.vue`  
**Line 10:**
```diff
- class="w-full h-full z-raised focus-visible:outline focus-visible:outline-offset focus-visible:rounded-md"
+ class="w-full h-full focus-visible:outline focus-visible:outline-offset focus-visible:rounded-md"
```

**File:** `apps/web/app/components/blocks/structure/Carousel/Carousel.vue`  
**Line 14:**
```diff
- class="!z-base !w-full !max-h-[85vh]"
+ class="!w-full !max-h-[85vh]"
```

---

## Phase 6: Update Tests

**File:** `apps/web/app/components/blocks/NavbarBottom/__tests__/NavbarBottom.spec.ts`  
**Line 45:**
```diff
- expect(nav.classes()).toContain('z-sticky');
+ expect(nav.classes()).toContain('z-overlay');
```

---

## Summary Checklist

### Phase 1: Quick Wins ⚡
- [ ] Remove `z-base` from EditableBlocks
- [ ] Remove `z-raised`/`z-sticky` from UtilityBar header
- [ ] Remove `z-sticky` from MegaMenu header + dynamic class
- [ ] Remove `z-sticky` from SimplifiedHeader
- [ ] Remove `z-sticky` from NavbarTop
- [ ] Remove `z-dropdown` from HeaderBlocks sticky

### Phase 2: Teleport Overlays 🚀
- [ ] MegaMenu: Teleport desktop dropdown
- [ ] MegaMenu: Teleport mobile drawer
- [ ] Cookiebar: Teleport both components
- [ ] AddBlockPopover: Teleport modal
- [ ] HtmlEditor: Teleport modal
- [ ] RichtextEditorModal: Teleport modal
- [ ] RichTextEditorLinkModal: Teleport modal
- [ ] ItemPropertiesSelectModal: Teleport overlay
- [ ] ImageSelectorModal: Teleport modal
- [ ] NotifyMe: Update z-index class
- [ ] PageModal variants: Update overlay-classes prop (3 files)
- [ ] EditorLocalizationDrawer: Teleport drawer
- [ ] Notifications: Teleport component

### Phase 3: Rename Z-Index Classes 🔄
- [ ] Run find-replace for all z-index class mappings
- [ ] Manually verify critical components

### Phase 4: Update Tailwind Config 🎨
- [ ] Replace zIndex object with 5-level system

### Phase 5: Remove Unused Classes 🧹
- [ ] MultiGrid components (3 changes)
- [ ] BlockActions & PageBlock (5 changes)
- [ ] Gallery (2 changes)
- [ ] SettingsToolbar & Editor panels (4 files)
- [ ] Miscellaneous (5 files)

### Phase 6: Update Tests ✅
- [ ] Update NavbarBottom test expectations

---

## Estimated Time

- **Phase 1:** 15 minutes
- **Phase 2:** 2 hours
- **Phase 3:** 30 minutes
- **Phase 4:** 5 minutes
- **Phase 5:** 1 hour
- **Phase 6:** 5 minutes

**Total:** ~4 hours

---

## Testing After Refactoring

1. **Visual regression testing:**
   - Desktop: Navigation, dropdowns, modals
   - Tablet: Drawers, responsive layouts
   - Mobile: Navbar, mega menu, all overlays

2. **Stacking verification:**
   - Open mega menu → should be above content blocks
   - Open mobile drawer → should be above everything
   - Open modal → should be above all other UI
   - Editor toolbar → should be accessible above modals

3. **Editor mode:**
   - Block editing overlays
   - Configuration drawers
   - Add block popover

4. **Edge cases:**
   - Nested modals (if any)
   - Multiple tooltips
   - Cookiebar + modal simultaneously
